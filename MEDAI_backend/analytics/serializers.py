from rest_framework import serializers


class AdherenceSummarySerializer(serializers.Serializer):
    period_start = serializers.DateField()
    period_end = serializers.DateField()
    total_scheduled = serializers.IntegerField()
    total_taken = serializers.IntegerField()
    total_missed = serializers.IntegerField()
    adherence_percentage = serializers.FloatField()


class TrendPointSerializer(serializers.Serializer):
    date = serializers.CharField()
    adherence_percentage = serializers.FloatField()
    taken = serializers.IntegerField()
    missed = serializers.IntegerField()


class MedicationWiseSerializer(serializers.Serializer):
    medication_id = serializers.IntegerField()
    medicine_name = serializers.CharField()
    adherence_percentage = serializers.FloatField()
    total_scheduled = serializers.IntegerField()
    total_taken = serializers.IntegerField()


class PatternSerializer(serializers.Serializer):
    type = serializers.CharField()
    message = serializers.CharField()


class RiskSerializer(serializers.Serializer):
    risk_level = serializers.CharField()
    label = serializers.CharField()
    missed_count = serializers.IntegerField()
    period_days = serializers.IntegerField()
