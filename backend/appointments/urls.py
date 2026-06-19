from django.urls import path

from .views import (
    AppointmentCreateView,
    DoctorAvailabilityListView,
    DoctorsBySpecialtyView,
    CreateAvailabilityView,
    MyAvailabilityView,
    MyAppointmentsView,
)


urlpatterns = [

    # Paciente crea una cita
    path(
        'appointments/',
        AppointmentCreateView.as_view()
    ),

    # Buscar médicos por especialidad
    path(
        'doctors/<int:specialty_id>/',
        DoctorsBySpecialtyView.as_view()
    ),

    # Ver horarios disponibles de un médico
    path(
        'availability/<int:doctor_id>/',
        DoctorAvailabilityListView.as_view()
    ),

    # Médico crea sus horarios
    path(
        'availability/create/',
        CreateAvailabilityView.as_view()
    ),

    # Médico consulta sus horarios
    path(
        'my-availability/',
        MyAvailabilityView.as_view()
    ),

    #Ver las citas del paciente identificado (o sea mis citas)
    path(
        'my/',
        MyAppointmentsView.as_view(),
        name='my-appointments'
    ),
]