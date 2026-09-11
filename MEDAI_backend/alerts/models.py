from django.db import models
from accounts.models import Patient
from medications.models import Medication


class Alert(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='alerts')
    medication = models.ForeignKey(Medication, on_delete=models.SET_NULL, blank=True, null=True, related_name='alerts')
    alert_type = models.CharField(max_length=80)  # e.g. 'repeated_missed_dose'
    description = models.CharField(max_length=255)
    missed_count = models.IntegerField(blank=True, null=True)
    period_days = models.IntegerField(blank=True, null=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'alerts'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['is_resolved']),
        ]

    def __str__(self):
        return f'{self.alert_type} - {self.patient}'
