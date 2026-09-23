from rest_framework import serializers
from .models import Alert


class AlertSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.full_name', read_only=True)
    medication_name = serializers.CharField(source='medication.medicine_name', read_only=True, allow_null=True)

    class Meta:
        model = Alert
        fields = [
            'id', 'patient_name', 'medication_name', 'alert_type', 'description',
            'missed_count', 'period_days', 'is_resolved', 'created_at',
        ]
        read_only_fields = fields
