from rest_framework import serializers


class LinkRequestCreateSerializer(serializers.Serializer):
    patient_email = serializers.EmailField()


class LinkedPatientSerializer(serializers.Serializer):
    link_id = serializers.IntegerField()
    patient_id = serializers.IntegerField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    adherence_percentage = serializers.FloatField()
    risk_level = serializers.CharField()
    status = serializers.CharField()


class PendingLinkRequestSerializer(serializers.Serializer):
    link_id = serializers.IntegerField()
    caregiver_name = serializers.CharField()
    caregiver_email = serializers.EmailField()
    relationship_type = serializers.CharField(allow_null=True)
    requested_at = serializers.DateTimeField()
