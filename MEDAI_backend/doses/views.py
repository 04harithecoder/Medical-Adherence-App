from django.utils import timezone
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from accounts.permissions import IsPatientUser
from medai_backend.responses import success, error
from medications.services import ensure_today_doses

from .models import DoseRecord
from .serializers import DoseRecordSerializer


class TodayDosesView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        patient = request.user.patient_profile
        ensure_today_doses(patient)

        today = timezone.localdate()
        doses = DoseRecord.objects.filter(
            patient=patient, scheduled_date=today
        ).select_related('medication').order_by('scheduled_time')

        return success(DoseRecordSerializer(doses, many=True).data)


class DoseHistoryView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        patient = request.user.patient_profile
        doses = DoseRecord.objects.filter(patient=patient).select_related('medication')

        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        if date_from:
            doses = doses.filter(scheduled_date__gte=date_from)
        if date_to:
            doses = doses.filter(scheduled_date__lte=date_to)

        doses = doses.order_by('-scheduled_date', '-scheduled_time')[:200]
        return success(DoseRecordSerializer(doses, many=True).data)


class _MarkDoseView(APIView):
    permission_classes = [IsPatientUser]
    target_status = None  # 'taken' or 'missed'

    def post(self, request, pk):
        dose = get_object_or_404(DoseRecord, pk=pk, patient=request.user.patient_profile)

        if dose.status in ('taken', 'missed'):
            return error(
                f'This dose was already marked as {dose.status}.',
                code='DOSE_ALREADY_RECORDED',
                status=409,
            )

        dose.status = self.target_status
        dose.action_time = timezone.now()
        dose.save(update_fields=['status', 'action_time', 'updated_at'])
        return success(DoseRecordSerializer(dose).data, message=f'Dose marked as {self.target_status}.')


class MarkDoseTakenView(_MarkDoseView):
    target_status = 'taken'


class MarkDoseMissedView(_MarkDoseView):
    target_status = 'missed'
