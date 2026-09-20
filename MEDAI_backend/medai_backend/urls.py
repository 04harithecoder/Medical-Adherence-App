from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('accounts.linking_urls')),
    path('api/medications', include('medications.urls')),
    path('api/doses', include('doses.urls')),
    path('api/adherence', include('analytics.urls')),
]
