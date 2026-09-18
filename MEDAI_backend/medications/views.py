from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from accounts.permissions import IsPatientUser
from medai_backend.responses import success, error

from .models import Medication, MedicationSchedule
from .serializers import MedicationSerializer, MedicationScheduleSerializer
from .services import generate_dose_records_for_schedule


class MedicationListCreateView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        medications = Medication.objects.filter(
            patient=request.user.patient_profile
        ).prefetch_related('schedules').order_by('-created_at')
        return success(MedicationSerializer(medications, many=True).data)

    def post(self, request):
        serializer = MedicationSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        medication = serializer.save()
        return success(
            MedicationSerializer(medication).data,
            message='Medication added.',
            status=201,
        )


class MedicationDetailView(APIView):
    permission_classes = [IsPatientUser]

    def _get_owned_medication(self, request, pk):
        return get_object_or_404(Medication, pk=pk, patient=request.user.patient_profile)

    def get(self, request, pk):
        medication = self._get_owned_medication(request, pk)
        return success(MedicationSerializer(medication).data)

    def put(self, request, pk):
        medication = self._get_owned_medication(request, pk)
        serializer = MedicationSerializer(
            medication, data=request.data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success(MedicationSerializer(medication).data, message='Medication updated.')

    def delete(self, request, pk):
        medication = self._get_owned_medication(request, pk)
        medication.delete()
        return success(message='Medication deleted.', status=200)


class MedicationScheduleCreateView(APIView):
    permission_classes = [IsPatientUser]

    def post(self, request, pk):
        medication = get_object_or_404(Medication, pk=pk, patient=request.user.patient_profile)
        serializer = MedicationScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save(medication=medication)
        generate_dose_records_for_schedule(schedule)
        return success(
            MedicationScheduleSerializer(schedule).data,
            message='Schedule added.',
            status=201,
        )
