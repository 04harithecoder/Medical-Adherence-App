"""
Turns a medication schedule into actual dose_records — the calendar of
doses a patient is expected to take. Kept deliberately simple (rule-based,
no AI) per Phase 1: "Do NOT create fake AI functionality."
"""
from datetime import timedelta

from django.utils import timezone

# How far ahead we pre-generate doses when a schedule is created/renewed.
GENERATION_WINDOW_DAYS = 30

DAY_CODES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']


def _schedule_applies_on(schedule, day):
    if schedule.days_of_week == 'ALL':
        return True
    wanted = {d.strip().upper() for d in schedule.days_of_week.split(',') if d.strip()}
    return DAY_CODES[day.weekday()] in wanted


def generate_dose_records_for_schedule(schedule, days_ahead=GENERATION_WINDOW_DAYS):
    """
    Creates DoseRecord rows for `schedule` from today through `days_ahead`
    days out (or the medication's end_date, whichever comes first).
    Safe to call repeatedly — get_or_create relies on the same unique
    constraint the DoseRecord model already enforces.
    """
    from doses.models import DoseRecord  # local import avoids a circular import at module load

    medication = schedule.medication
    today = timezone.localdate()
    start = max(today, medication.start_date)
    end = today + timedelta(days=days_ahead)
    if medication.end_date and medication.end_date < end:
        end = medication.end_date

    created = 0
    day = start
    while day <= end:
        if _schedule_applies_on(schedule, day):
            _, was_created = DoseRecord.objects.get_or_create(
                schedule=schedule,
                scheduled_date=day,
                scheduled_time=schedule.scheduled_time,
                defaults={
                    'patient': medication.patient,
                    'medication': medication,
                },
            )
            created += was_created
        day += timedelta(days=1)
    return created


def ensure_today_doses(patient):
    """
    Called whenever a patient views 'today's doses' — guarantees today's
    rows exist even if the schedule was generated on an earlier visit and
    the 30-day window logic hasn't been re-run since.
    """
    from medications.models import MedicationSchedule

    schedules = MedicationSchedule.objects.filter(
        medication__patient=patient,
        medication__is_active=True,
        is_active=True,
    ).select_related('medication')

    for schedule in schedules:
        generate_dose_records_for_schedule(schedule, days_ahead=0)
