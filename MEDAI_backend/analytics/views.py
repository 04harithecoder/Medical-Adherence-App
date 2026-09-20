from datetime import date, timedelta

from rest_framework.views import APIView

from accounts.permissions import IsPatientUser
from medai_backend.responses import success

from . import services
from .serializers import (
    AdherenceSummarySerializer,
    TrendPointSerializer,
    MedicationWiseSerializer,
    PatternSerializer,
    RiskSerializer,
)

# Every view here is patient-scoped only for now — caregiver access to a
# linked patient's analytics arrives with the caregiver-linking work
# (Phase 7), same as the rest of the caregiver-facing APIs.


class AdherenceSummaryView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        period = request.query_params.get('period', 'weekly')
        end = date.today()
        days = {'daily': 1, 'weekly': 7, 'monthly': 30}.get(period, 7)
        start = end - timedelta(days=days - 1)

        data = services.compute_adherence(request.user.patient_profile, start, end)
        return success(AdherenceSummarySerializer(data).data)


class AdherenceTrendsView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        period = request.query_params.get('period', 'weekly')
        days = 30 if period == 'monthly' else 7

        points = services.get_daily_trend(request.user.patient_profile, days=days)
        return success(TrendPointSerializer(points, many=True).data)


class MedicationWiseView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        data = services.get_medication_wise(request.user.patient_profile)
        return success(MedicationWiseSerializer(data, many=True).data)


class PatternsView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        patterns = services.detect_patterns(request.user.patient_profile)
        return success(PatternSerializer(patterns, many=True).data)


class RiskView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        risk = services.compute_risk_level(request.user.patient_profile)
        return success(RiskSerializer(risk).data)
