"""
Caregiver <-> Patient linking flow (Phase 6.5).

A caregiver sends a link request by the patient's email. The patient
sees it as a pending request and explicitly approves or rejects it —
a caregiver can never see a patient's data without that approval.
This is what makes the Caregiver Dashboard / Linked Patients pages real
instead of Phase 2 mock data.
"""
from datetime import date, timedelta

from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from analytics.services import compute_adherence, compute_risk_level
from medai_backend.responses import success, error

from .models import User, CaregiverPatientLink
from .permissions import IsCaregiverUser, IsPatientUser
from .linking_serializers import (
    LinkRequestCreateSerializer,
    LinkedPatientSerializer,
    PendingLinkRequestSerializer,
)


class SendLinkRequestView(APIView):
    permission_classes = [IsCaregiverUser]

    def post(self, request):
        serializer = LinkRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['patient_email']

        try:
            patient_user = User.objects.get(email__iexact=email, role='patient')
        except User.DoesNotExist:
            return error('No patient account found with that email.', code='PATIENT_NOT_FOUND', status=404)

        patient = patient_user.patient_profile
        caregiver = request.user.caregiver_profile

        link, created = CaregiverPatientLink.objects.get_or_create(
            caregiver=caregiver, patient=patient, defaults={'status': 'pending'},
        )
        if not created:
            if link.status == 'active':
                return error('You are already linked with this patient.', code='ALREADY_LINKED', status=400)
            if link.status == 'pending':
                return error('A link request is already pending for this patient.', code='ALREADY_PENDING', status=400)
            # Previously revoked — allow requesting again.
            link.status = 'pending'
            link.save()

        return success(message='Link request sent. Waiting for the patient to approve.', status=201)


class CaregiverLinkedPatientsView(APIView):
    permission_classes = [IsCaregiverUser]

    def get(self, request):
        links = CaregiverPatientLink.objects.filter(
            caregiver=request.user.caregiver_profile, status='active'
        ).select_related('patient__user')

        today = date.today()
        start = today - timedelta(days=13)
        data = []
        for link in links:
            patient = link.patient
            stats = compute_adherence(patient, start, today)
            risk = compute_risk_level(patient)
            data.append({
                'link_id': link.id,
                'patient_id': patient.id,
                'full_name': patient.user.full_name,
                'email': patient.user.email,
                'adherence_percentage': stats['adherence_percentage'],
                'risk_level': risk['risk_level'],
                'status': link.status,
            })
        return success(LinkedPatientSerializer(data, many=True).data)


class PatientLinkRequestsView(APIView):
    permission_classes = [IsPatientUser]

    def get(self, request):
        links = CaregiverPatientLink.objects.filter(
            patient=request.user.patient_profile, status='pending'
        ).select_related('caregiver__user')

        data = [{
            'link_id': link.id,
            'caregiver_name': link.caregiver.user.full_name,
            'caregiver_email': link.caregiver.user.email,
            'relationship_type': link.caregiver.relationship_type,
            'requested_at': link.linked_at,
        } for link in links]
        return success(PendingLinkRequestSerializer(data, many=True).data)


class ApproveLinkRequestView(APIView):
    permission_classes = [IsPatientUser]

    def post(self, request, pk):
        link = get_object_or_404(
            CaregiverPatientLink, pk=pk, patient=request.user.patient_profile, status='pending'
        )
        link.status = 'active'
        link.save()
        return success(message='Caregiver link approved.')


class RejectLinkRequestView(APIView):
    permission_classes = [IsPatientUser]

    def post(self, request, pk):
        link = get_object_or_404(
            CaregiverPatientLink, pk=pk, patient=request.user.patient_profile, status='pending'
        )
        link.status = 'revoked'
        link.save()
        return success(message='Caregiver link rejected.')
