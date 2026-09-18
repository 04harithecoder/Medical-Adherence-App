from rest_framework import serializers

from .models import DoseRecord


class DoseRecordSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medication.medicine_name', read_only=True)
    dosage_description = serializers.CharField(source='medication.dosage_description', read_only=True)

    class Meta:
        model = DoseRecord
        fields = [
            'id', 'medicine_name', 'dosage_description',
            'scheduled_date', 'scheduled_time', 'status', 'action_time',
        ]
        read_only_fields = fields
