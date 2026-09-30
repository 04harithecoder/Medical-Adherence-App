from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include


def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'MEDAI API'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health', health_check),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('accounts.linking_urls')),
    path('api/medications', include('medications.urls')),
    path('api/doses', include('doses.urls')),
    path('api/adherence', include('analytics.urls')),
    path('api/alerts', include('alerts.urls')),
    path('api/notifications', include('notifications.urls')),
]
