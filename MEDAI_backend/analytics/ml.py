"""
Phase 8 — optional ML layer: predicts the probability that a given
upcoming dose will be missed.

This sits ALONGSIDE the rule-based "Adherence Pattern Risk" from Phase 6
(analytics/services.py) — it does not replace it. Per the Phase 1 brief:
"Do NOT create fake AI functionality just to claim AI exists." So:

- If no model has been trained yet, predict_miss_probability() returns
  None. Callers must treat None as "no ML signal available yet", never
  fabricate a number.
- Every feature here is CAUSAL: it only ever looks at dose records
  strictly BEFORE the dose being scored/trained on. This prevents
  training-time leakage (the model must never see the future).
"""
import os

import joblib
import numpy as np
from django.conf import settings

MODEL_PATH = os.path.join(settings.BASE_DIR, 'analytics', 'ml_model.joblib')

FEATURE_NAMES = [
    'hour',
    'is_evening',
    'is_morning',
    'is_weekend',
    'patient_prior_miss_rate',
    'medication_prior_miss_rate',
    'days_since_start',
]

_model_cache = None


def _load_model():
    global _model_cache
    if _model_cache is None and os.path.exists(MODEL_PATH):
        _model_cache = joblib.load(MODEL_PATH)
    return _model_cache


def model_is_trained():
    return _load_model() is not None


def extract_features(dose):
    """
    Builds the feature vector for one dose record. Only ever queries
    dose records with scheduled_date STRICTLY BEFORE this one, for the
    same patient / same medication, so the model can never peek ahead.
    """
    from doses.models import DoseRecord  # local import avoids an app-loading cycle

    hour = dose.scheduled_time.hour
    day_of_week = dose.scheduled_date.weekday()

    prior_patient = DoseRecord.objects.filter(
        patient=dose.patient, scheduled_date__lt=dose.scheduled_date
    ).exclude(status='scheduled')
    p_total = prior_patient.count()
    p_missed = prior_patient.filter(status='missed').count()
    # Laplace smoothing so a patient with zero history isn't 0% or 100%.
    patient_prior_miss_rate = (p_missed + 1) / (p_total + 2)

    prior_medication = prior_patient.filter(medication_id=dose.medication_id)
    m_total = prior_medication.count()
    m_missed = prior_medication.filter(status='missed').count()
    medication_prior_miss_rate = (m_missed + 1) / (m_total + 2)

    days_since_start = max((dose.scheduled_date - dose.medication.start_date).days, 0)

    return [
        float(hour),
        1.0 if hour >= 17 else 0.0,
        1.0 if hour < 12 else 0.0,
        1.0 if day_of_week >= 5 else 0.0,
        patient_prior_miss_rate,
        medication_prior_miss_rate,
        float(days_since_start),
    ]


def predict_miss_probability(dose):
    """Returns a float in [0, 1], or None if no model has been trained yet."""
    model = _load_model()
    if model is None:
        return None
    features = np.array([extract_features(dose)])
    probability = model.predict_proba(features)[0][1]
    return round(float(probability), 4)
