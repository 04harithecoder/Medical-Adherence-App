from django.contrib import admin
from .models import AdherenceAnalysis

@admin.register(AdherenceAnalysis)
class AdherenceAnalysisAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'period_type', 'period_start', 'period_end', 'adherence_percentage', 'risk_level')
    list_filter = ('period_type', 'risk_level')
