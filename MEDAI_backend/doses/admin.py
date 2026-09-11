from django.contrib import admin
from .models import DoseRecord

@admin.register(DoseRecord)
class DoseRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'medication', 'patient', 'scheduled_date', 'scheduled_time', 'status')
    list_filter = ('status',)
