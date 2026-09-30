"""
Trains the optional Phase 8 missed-dose-probability model on real
historical DoseRecord data (across all patients — pooled, not
per-patient, since any single patient's history is too small to train
on alone; each patient's own tendency is captured via the
patient_prior_miss_rate feature instead).

Run manually whenever you want to (re)train, e.g. after accumulating
more real usage data:

    python manage.py train_adherence_model

Safe to run anytime — only reads DoseRecord history and overwrites the
saved model file. Never touches live data. If there isn't enough
labeled history yet, it skips training rather than saving a model that
would just be guessing — the Phase 6 rule-based risk engine keeps
working regardless.
"""
import os

import joblib
import numpy as np
from django.core.management.base import BaseCommand
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from analytics.ml import MODEL_PATH, extract_features
from doses.models import DoseRecord

MIN_SAMPLES = 20


class Command(BaseCommand):
    help = 'Trains the missed-dose-probability logistic regression model (Phase 8).'

    def handle(self, *args, **options):
        doses = (
            DoseRecord.objects.exclude(status='scheduled')
            .select_related('patient', 'medication')
            .order_by('scheduled_date')
        )

        X, y = [], []
        for dose in doses:
            X.append(extract_features(dose))
            y.append(1 if dose.status == 'missed' else 0)

        if len(X) < MIN_SAMPLES:
            self.stdout.write(self.style.WARNING(
                f'Only {len(X)} labeled dose records found (need at least {MIN_SAMPLES}). '
                'Skipping training — the rule-based Adherence Pattern Risk from Phase 6 '
                'keeps working as-is; predictions will simply stay unavailable until '
                'there is enough history.'
            ))
            return

        if len(set(y)) < 2:
            self.stdout.write(self.style.WARNING(
                'All labeled doses are the same outcome (all taken or all missed) — '
                'need at least some of both to train a classifier. Skipping.'
            ))
            return

        X, y = np.array(X), np.array(y)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
        model.fit(X_train, y_train)

        accuracy = accuracy_score(y_test, model.predict(X_test))
        try:
            auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
            auc_text = f', ROC-AUC: {auc:.3f}'
        except ValueError:
            auc_text = ''  # only one class present in the test split

        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(model, MODEL_PATH)

        self.stdout.write(self.style.SUCCESS(
            f'Trained on {len(X_train)} samples, tested on {len(X_test)} held-out samples. '
            f'Test accuracy: {accuracy:.2%}{auc_text}'
        ))
        self.stdout.write(f'Model saved to {MODEL_PATH}')
