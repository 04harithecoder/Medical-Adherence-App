"""
Caregiver alert generation (Phase 1 section 12): when a patient's missed
doses cross the same threshold used for "Adherence Pattern Risk" (Phase 6),
create an Alert row and notify every actively-linked caregiver.

Deliberately reuses analytics.services.THRESHOLDS rather than a second
copy of the numbers, so "what counts as concerning" stays defined in one
place.
"""
from datetime import date, timedelta

from analytics.services import THRESHOLDS
from doses.models import DoseRecord
from notifications.models import Notification

from .models import Alert


def check_and_create_alert(patient):
    """
    Call this after a dose is marked missed. Returns the Alert if one was
    created/updated, or None if the patient isn't over threshold.
    """
    period_days = THRESHOLDS['risk_period_days']
    threshold = THRESHOLDS['high_missed_count']
    start = date.today() - timedelta(days=period_days - 1)

    missed_qs = DoseRecord.objects.filter(
        patient=patient, scheduled_date__gte=start, scheduled_date__lte=date.today(), status='missed'
    )
    missed_count = missed_qs.count()
    if missed_count < threshold:
        return None

    # Don't spam a new alert every single miss — update the existing
    # unresolved one from this window instead.
    existing = Alert.objects.filter(
        patient=patient, alert_type='repeated_missed_dose', is_resolved=False,
        created_at__date__gte=start,
    ).first()
    if existing:
        existing.missed_count = missed_count
        existing.save(update_fields=['missed_count'])
        return existing

    latest_missed = missed_qs.select_related('medication').order_by('-scheduled_date').first()

    alert = Alert.objects.create(
        patient=patient,
        medication=latest_missed.medication if latest_missed else None,
        alert_type='repeated_missed_dose',
        description=f'Repeated missed-dose pattern detected for {patient.user.full_name}.',
        missed_count=missed_count,
        period_days=period_days,
    )

    # Notify every caregiver actively linked to this patient — never an
    # unapproved/pending one (see Phase 6.5 linking rules).
    for link in patient.caregiver_links.filter(status='active').select_related('caregiver__user'):
        Notification.objects.create(
            user=link.caregiver.user,
            type='alert',
            title='Adherence alert',
            message=alert.description,
            related_id=alert.id,
        )

    return alert
