from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from users.models import User
from users.serializers import UserSummarySerializer

from users.permissions import IsDoctor
from users.permissions import IsPatient
from rest_framework.permissions import BasePermission

from .models import Appointment, DoctorAvailability
from .serializers import (
    AppointmentSerializer,
    DoctorAvailabilitySerializer,
    CreateAvailabilitySerializer,
    MyAppointmentSerializer
)


class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsPatient]

    def perform_create(self, serializer):

        appointment = serializer.save(
            patient=self.request.user
        )

        DoctorAvailability.objects.filter(
            doctor=appointment.doctor,
            date=appointment.appointment_date,
            time=appointment.appointment_time
        ).update(
            is_available=False
        )


class DoctorAvailabilityListView(generics.ListAPIView):

    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):

        doctor_id = self.kwargs['doctor_id']
        selected_date = self.request.query_params.get('date')


        queryset = DoctorAvailability.objects.filter(
            doctor_id=doctor_id,
            is_available=True
        )


        if selected_date:
            queryset = queryset.filter(
                date=selected_date
            )


        return queryset


class DoctorsBySpecialtyView(generics.ListAPIView):
    serializer_class = UserSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        specialty_id = self.kwargs['specialty_id']

        return User.objects.filter(
            role='doctor',
            specialty_id=specialty_id,
            is_active=True
        )

class CreateAvailabilityView(
    generics.CreateAPIView
):

    serializer_class = CreateAvailabilitySerializer
    permission_classes = [IsDoctor]

    def perform_create(self, serializer):

        serializer.save(
            doctor=self.request.user
        )

class MyAvailabilityView(
    generics.ListAPIView
):

    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):

        return DoctorAvailability.objects.filter(
            doctor=self.request.user
        ).order_by(
            'date',
            'time'
        )

class IsDoctor(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'doctor'
        )

class MyAppointmentsView(generics.ListAPIView):

    serializer_class = MyAppointmentSerializer
    permission_classes = [IsPatient]

    def get_queryset(self):

        return Appointment.objects.filter(
            patient=self.request.user
        ).order_by(
            '-appointment_date',
            '-appointment_time'
        )