"""
Smart Reminder System (Phase 1 section 11).

Scans today's scheduled doses and creates:
- an "upcoming dose" reminder when a dose is due within its reminder window
- a "dose overdue" nudge when a dose is OVERDUE_GRACE_MINUTES past due and
  still unmarked (the patient still has to mark it taken/missed themselves
  — this never auto-marks a dose, per the Phase 1 medical safety boundary)

Phase 8 personalization: if the optional ML model has been trained and
predicts a dose is likely to be missed, the reminder window widens from
REMINDER_WINDOW_MINUTES to EARLY_REMINDER_WINDOW_MINUTES — i.e. exactly
the "Consider setting an earlier reminder" behavior described in the
Phase 1 brief. If no model is trained yet, this silently falls back to
the plain fixed window — this file works identically whether or not
Phase 8 has been run.

This is a plain Django management command rather than a Celery task, to
avoid pulling in a task queue for a project this size. Run it periodically
via cron (Linux/Render) or Windows Task Scheduler, e.g. every 15 minutes:

    * * * * * cd /path/to/MEDAI_backend && venv/bin/python manage.py generate_reminders

Each notification is only created once per dose (checked via related_id),
so running this often is safe — it won't duplicate.
"""
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from analytics.ml import predict_miss_probability
from doses.models import DoseRecord
from notifications.models import Notification

REMINDER_WINDOW_MINUTES = 30
EARLY_REMINDER_WINDOW_MINUTES = 90  # for doses the ML model flags as likely to be missed
HIGH_MISS_PROBABILITY_THRESHOLD = 0.5
OVERDUE_GRACE_MINUTES = 60


class Command(BaseCommand):
    help = "Generates upcoming-dose and overdue-dose reminder notifications for today's doses."

    def handle(self, *args, **options):
        now = timezone.localtime()
        today = now.date()
        created = 0

        doses = DoseRecord.objects.filter(
            scheduled_date=today, status='scheduled'
        ).select_related('medication', 'patient__user')

        for dose in doses:
            naive_dt = datetime.combine(today, dose.scheduled_time)
            scheduled_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())
            minutes_until = (scheduled_dt - now).total_seconds() / 60

            miss_probability = predict_miss_probability(dose)
            is_high_risk = miss_probability is not None and miss_probability >= HIGH_MISS_PROBABILITY_THRESHOLD
            reminder_window = EARLY_REMINDER_WINDOW_MINUTES if is_high_risk else REMINDER_WINDOW_MINUTES

            if 0 <= minutes_until <= reminder_window:
                already_sent = Notification.objects.filter(
                    user=dose.patient.user, type='reminder', related_id=dose.id
                ).exists()
                if not already_sent:
                    message = f'{dose.medication.medicine_name} is due at {dose.scheduled_time.strftime("%I:%M %p")}.'
                    if is_high_risk:
                        message += ' You often miss this one — consider setting an earlier reminder.'
                    Notification.objects.create(
                        user=dose.patient.user,
                        type='reminder',
                        title='Upcoming dose',
                        message=message,
                        related_id=dose.id,
                    )
                    created += 1

            elif minutes_until < -OVERDUE_GRACE_MINUTES:
                already_sent = Notification.objects.filter(
                    user=dose.patient.user, type='missed_dose', related_id=dose.id
                ).exists()
                if not already_sent:
                    Notification.objects.create(
                        user=dose.patient.user,
                        type='missed_dose',
                        title='Dose overdue',
                        message=f'{dose.medication.medicine_name} was due at {dose.scheduled_time.strftime("%I:%M %p")} — mark it taken or missed.',
                        related_id=dose.id,
                    )
                    created += 1

        self.stdout.write(self.style.SUCCESS(f'Created {created} reminder notification(s).'))
