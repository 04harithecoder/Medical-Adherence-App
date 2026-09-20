from django.urls import path

from .linking_views import (
    SendLinkRequestView,
    CaregiverLinkedPatientsView,
    PatientLinkRequestsView,
    ApproveLinkRequestView,
    RejectLinkRequestView,
)

urlpatterns = [
    path('caregiver/link-requests', SendLinkRequestView.as_view(), name='caregiver-send-link-request'),
    path('caregiver/patients', CaregiverLinkedPatientsView.as_view(), name='caregiver-patients'),
    path('patient/link-requests', PatientLinkRequestsView.as_view(), name='patient-link-requests'),
    path('patient/link-requests/<int:pk>/approve', ApproveLinkRequestView.as_view(), name='patient-link-approve'),
    path('patient/link-requests/<int:pk>/reject', RejectLinkRequestView.as_view(), name='patient-link-reject'),
]
