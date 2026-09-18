from rest_framework import serializers

from .models import Medication, MedicationSchedule


class MedicationScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationSchedule
        fields = ['id', 'scheduled_time', 'days_of_week', 'is_active']
        read_only_fields = ['id']


class MedicationSerializer(serializers.ModelSerializer):
    schedules = MedicationScheduleSerializer(many=True, required=False)

    class Meta:
        model = Medication
        fields = [
            'id', 'medicine_name', 'dosage_description', 'frequency',
            'instructions', 'start_date', 'end_date', 'is_active',
            'schedules', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        from .services import generate_dose_records_for_schedule

        schedules_data = validated_data.pop('schedules', [])
        patient = self.context['request'].user.patient_profile
        medication = Medication.objects.create(patient=patient, **validated_data)

        for schedule_data in schedules_data:
            schedule = MedicationSchedule.objects.create(medication=medication, **schedule_data)
            generate_dose_records_for_schedule(schedule)

        return medication

    def update(self, instance, validated_data):
        # Schedules are managed through their own endpoint once the
        # medication exists — this only updates the medication's own fields.
        validated_data.pop('schedules', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
