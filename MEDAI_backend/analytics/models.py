from django.db import models
from accounts.models import Patient


class AdherenceAnalysis(models.Model):
    PERIOD_CHOICES = [('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')]
    RISK_CHOICES = [('low', 'Low'), ('moderate', 'Moderate'), ('high', 'High')]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='adherence_analyses')
    period_type = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    period_start = models.DateField()
    period_end = models.DateField()
    total_scheduled = models.IntegerField(default=0)
    total_taken = models.IntegerField(default=0)
    total_missed = models.IntegerField(default=0)
    adherence_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES, default='low')
    detected_patterns = models.JSONField(blank=True, null=True)  # e.g. ["evening_miss_streak"]
    computed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'adherence_analysis'
        indexes = [models.Index(fields=['patient', 'period_type', 'period_start'])]

    def __str__(self):
        return f'{self.patient} {self.period_type} {self.period_start} -> {self.adherence_percentage}%'
