from django.urls import path

from .views import MedicationListCreateView, MedicationDetailView, MedicationScheduleCreateView

urlpatterns = [
    path('', MedicationListCreateView.as_view(), name='medication-list-create'),
    path('/<int:pk>', MedicationDetailView.as_view(), name='medication-detail'),
    path('/<int:pk>/schedules', MedicationScheduleCreateView.as_view(), name='medication-schedule-create'),
]
