from django.contrib import admin
from .models import Specialty


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'doctor_count', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)
