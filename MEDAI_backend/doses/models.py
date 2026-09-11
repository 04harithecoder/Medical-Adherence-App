from django.db import models
from accounts.models import Patient
from medications.models import Medication, MedicationSchedule


class DoseRecord(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('taken', 'Taken'),
        ('missed', 'Missed'),
        ('skipped', 'Skipped'),
    ]

    schedule = models.ForeignKey(MedicationSchedule, on_delete=models.CASCADE, related_name='dose_records')
    # Denormalized for fast patient/date queries — see Phase 1 schema notes.
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='dose_records')
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name='dose_records')
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='scheduled')
    action_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dose_records'
        unique_together = ('schedule', 'scheduled_date', 'scheduled_time')
        indexes = [
            models.Index(fields=['patient', 'scheduled_date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f'{self.medication.medicine_name} - {self.scheduled_date} ({self.status})'
