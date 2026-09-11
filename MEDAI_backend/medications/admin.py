from django.contrib import admin
from .models import Medication, MedicationSchedule

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'medicine_name', 'patient', 'frequency', 'is_active', 'start_date', 'end_date')
    list_filter = ('is_active',)

@admin.register(MedicationSchedule)
class MedicationScheduleAdmin(admin.ModelAdmin):
    list_display = ('id', 'medication', 'scheduled_time', 'days_of_week', 'is_active')
