from django.contrib import admin
from .models import Appointment, DoctorAvailability


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'patient',
        'doctor',
        'specialty',
        'appointment_date',
        'appointment_time',
        'status',
    )


@admin.register(DoctorAvailability)
class DoctorAvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        'doctor',
        'date',
        'time',
        'is_available',
    )