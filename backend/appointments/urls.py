from django.urls import path

from .views import (
    AppointmentCreateView,
    DoctorAvailabilityListView,
    DoctorsBySpecialtyView,
    CreateAvailabilityView,
    MyAvailabilityView,
    MyAppointmentsView,
    UpdateAppointmentView,
    CancelAppointmentView,  
    RescheduleAppointmentView,
    AppointmentHistoryView,
    DoctorAppointmentsView,
    UpdateAppointmentStatusView,
    DoctorDashboardView
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

    #Modificar citas
    path(
        'appointments/<int:pk>/',
        UpdateAppointmentView.as_view(),
        name='update-appointment'
    ),

    path(
        'appointments/<int:pk>/reschedule/',
        RescheduleAppointmentView.as_view(),
        name='reschedule-appointment'
    ),

    #Cancelar cita
    path(
        'appointments/<int:pk>/cancel/',
        CancelAppointmentView.as_view(),
        name='cancel-appointment'
    ),

    path(
        'history/',
        AppointmentHistoryView.as_view(),
        name='appointment-history'
    ),

    path(
        'doctor/appointments/',
        DoctorAppointmentsView.as_view(),
        name='doctor-appointments'
    ),

    path(
        'doctor/appointments/<int:pk>/status/',
        UpdateAppointmentStatusView.as_view(),
        name='doctor-update-status'
    ),

    path(
        'doctor/dashboard/',
        DoctorDashboardView.as_view(),
        name='doctor-dashboard'
    ),
]