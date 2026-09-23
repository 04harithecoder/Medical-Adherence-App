from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from accounts.models import CaregiverPatientLink
from accounts.permissions import IsCaregiverUser
from medai_backend.responses import success

from .models import Alert
from .serializers import AlertSerializer


class AlertListView(APIView):
    """
    A patient sees their own alerts; a caregiver sees alerts for every
    patient they're actively linked with (see Phase 6.5 linking rules —
    never a pending/revoked link).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            qs = Alert.objects.filter(patient=user.patient_profile)
        elif user.role == 'caregiver' and hasattr(user, 'caregiver_profile'):
            patient_ids = CaregiverPatientLink.objects.filter(
                caregiver=user.caregiver_profile, status='active'
            ).values_list('patient_id', flat=True)
            qs = Alert.objects.filter(patient_id__in=patient_ids)
        else:
            qs = Alert.objects.none()

        qs = qs.select_related('patient__user', 'medication').order_by('-created_at')
        return success(AlertSerializer(qs, many=True).data)


class ResolveAlertView(APIView):
    permission_classes = [IsCaregiverUser]

    def patch(self, request, pk):
        patient_ids = CaregiverPatientLink.objects.filter(
            caregiver=request.user.caregiver_profile, status='active'
        ).values_list('patient_id', flat=True)
        alert = get_object_or_404(Alert, pk=pk, patient_id__in=patient_ids)
        alert.is_resolved = True
        alert.save(update_fields=['is_resolved'])
        return success(message='Alert marked resolved.')
