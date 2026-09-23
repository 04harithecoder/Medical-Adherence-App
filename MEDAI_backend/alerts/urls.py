from django.urls import path
from .views import AlertListView, ResolveAlertView

urlpatterns = [
    path('', AlertListView.as_view(), name='alerts-list'),
    path('/<int:pk>/resolve', ResolveAlertView.as_view(), name='alert-resolve'),
]
