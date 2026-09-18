from django.urls import path

from .views import TodayDosesView, DoseHistoryView, MarkDoseTakenView, MarkDoseMissedView

urlpatterns = [
    path('/today', TodayDosesView.as_view(), name='doses-today'),
    path('/history', DoseHistoryView.as_view(), name='doses-history'),
    path('/<int:pk>/taken', MarkDoseTakenView.as_view(), name='dose-taken'),
    path('/<int:pk>/missed', MarkDoseMissedView.as_view(), name='dose-missed'),
]
