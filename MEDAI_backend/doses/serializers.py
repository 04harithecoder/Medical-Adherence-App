from rest_framework import serializers

from analytics.ml import predict_miss_probability

from .models import DoseRecord


class DoseRecordSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medication.medicine_name', read_only=True)
    dosage_description = serializers.CharField(source='medication.dosage_description', read_only=True)
    predicted_miss_probability = serializers.SerializerMethodField()

    class Meta:
        model = DoseRecord
        fields = [
            'id', 'medicine_name', 'dosage_description',
            'scheduled_date', 'scheduled_time', 'status', 'action_time',
            'predicted_miss_probability',
        ]
        read_only_fields = fields

    def get_predicted_miss_probability(self, dose):
        # Only meaningful for doses that haven't happened yet — and only
        # if a model has actually been trained (Phase 8 is optional; this
        # stays None rather than fabricating a number when untrained).
        if dose.status != 'scheduled':
            return None
        return predict_miss_probability(dose)
