from django.db import models
from accounts.models import Patient


class Medication(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')
    medicine_name = models.CharField(max_length=150)
    dosage_description = models.CharField(max_length=150)
    frequency = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'medications'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f'{self.medicine_name} ({self.patient})'


class MedicationSchedule(models.Model):
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name='schedules')
    scheduled_time = models.TimeField()
    days_of_week = models.CharField(max_length=20, default='ALL')  # 'ALL' or 'MON,WED,FRI'
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'medication_schedules'
        indexes = [models.Index(fields=['medication'])]

    def __str__(self):
        return f'{self.medication.medicine_name} @ {self.scheduled_time}'
