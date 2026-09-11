from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'alert_type', 'missed_count', 'is_resolved', 'created_at')
    list_filter = ('is_resolved', 'alert_type')
