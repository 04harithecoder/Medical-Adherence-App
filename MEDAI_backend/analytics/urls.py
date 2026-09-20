from django.urls import path

from .views import (
    AdherenceSummaryView,
    AdherenceTrendsView,
    MedicationWiseView,
    PatternsView,
    RiskView,
)

urlpatterns = [
    path('/summary', AdherenceSummaryView.as_view(), name='adherence-summary'),
    path('/trends', AdherenceTrendsView.as_view(), name='adherence-trends'),
    path('/medication-wise', MedicationWiseView.as_view(), name='adherence-medication-wise'),
    path('/patterns', PatternsView.as_view(), name='adherence-patterns'),
    path('/risk', RiskView.as_view(), name='adherence-risk'),
]
