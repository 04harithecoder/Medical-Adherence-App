from django.contrib import admin
from .models import User, Patient, Caregiver, CaregiverPatientLink

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'role', 'is_active', 'created_at')
    search_fields = ('full_name', 'email')
    list_filter = ('role', 'is_active')

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date_of_birth', 'gender')

@admin.register(Caregiver)
class CaregiverAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'relationship_type')

@admin.register(CaregiverPatientLink)
class CaregiverPatientLinkAdmin(admin.ModelAdmin):
    list_display = ('id', 'caregiver', 'patient', 'status', 'linked_at')
    list_filter = ('status',)
