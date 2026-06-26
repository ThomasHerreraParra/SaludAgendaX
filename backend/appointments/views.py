from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from users.models import User, EPSConfiguration
from users.serializers import UserSummarySerializer

from users.permissions import IsDoctor
from users.permissions import IsPatient
from rest_framework.permissions import BasePermission

from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import maintain_system
from datetime import date, timedelta

from .models import Appointment, DoctorAvailability
from .serializers import (
    AppointmentSerializer,
    DoctorAvailabilitySerializer,
    CreateAvailabilitySerializer,
    MyAppointmentSerializer,
    DoctorAppointmentSerializer,
    DoctorScheduleSerializer,
    DoctorDashboardSerializer
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
            is_available=True,
            date__gte=date.today()
        )


        if selected_date:
            queryset = queryset.filter(
                date=selected_date
            )


        return queryset
    
    def get_queryset(self):

        maintain_system()

        doctor_id = self.kwargs['doctor_id']
        selected_date = self.request.query_params.get('date')

        queryset = DoctorAvailability.objects.filter(
            doctor_id=doctor_id,
            is_available=True,
            date__gte=date.today()
        )

        if selected_date:
            queryset = queryset.filter(
                date=selected_date
            )

        return queryset

class AppointmentHistoryView(generics.ListAPIView):

    serializer_class = MyAppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Appointment.objects.filter(
            patient=self.request.user
        ).order_by('-appointment_date')


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

    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):

        return DoctorAvailability.objects.filter(
            doctor=self.request.user
        ).order_by(
            'date',
            'time'
        )

    def get_queryset(self):

        maintain_system()

        return DoctorAvailability.objects.filter(
            doctor=self.request.user,
            date__gte=date.today()
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

class UpdateAppointmentView(
    generics.UpdateAPIView
):

    serializer_class = AppointmentSerializer
    permission_classes = [IsPatient]


    def get_queryset(self):

        return Appointment.objects.filter(
            patient=self.request.user
        )


    def perform_update(self, serializer):

        appointment = self.get_object()


        old_date = appointment.appointment_date
        old_time = appointment.appointment_time


        new_date = serializer.validated_data.get(
            'appointment_date',
            old_date
        )

        new_time = serializer.validated_data.get(
            'appointment_time',
            old_time
        )


        # liberar horario anterior

        DoctorAvailability.objects.filter(
            doctor=appointment.doctor,
            date=old_date,
            time=old_time
        ).update(
            is_available=True
        )


        # consumir nuevo horario

        DoctorAvailability.objects.filter(
            doctor=appointment.doctor,
            date=new_date,
            time=new_time
        ).update(
            is_available=False
        )


        serializer.save()

class RescheduleAppointmentView(APIView):

    permission_classes = [IsPatient]


    def patch(self, request, pk):

        try:
            appointment = Appointment.objects.get(
                id=pk,
                patient=request.user
            )

            if appointment.status != 'pending':
                return Response(
                    {
                        "detail": "Solo se pueden reprogramar citas pendientes."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Appointment.DoesNotExist:

            return Response(
                {
                    "detail": "Cita no encontrada"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        


        new_date = request.data.get(
            "appointment_date"
        )

        new_time = request.data.get(
            "appointment_time"
        )


        if not new_date or not new_time:

            return Response(
                {
                    "detail": "Debe enviar nueva fecha y hora"
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # verificar que el horario nuevo exista

        new_availability = DoctorAvailability.objects.filter(
            doctor=appointment.doctor,
            date=new_date,
            time=new_time,
            is_available=True
        ).first()


        if not new_availability:

            return Response(
                {
                    "detail": "Horario no disponible"
                },
                status=status.HTTP_400_BAD_REQUEST
            )



        # liberar horario anterior

        old_availability = DoctorAvailability.objects.filter(
            doctor=appointment.doctor,
            date=appointment.appointment_date,
            time=appointment.appointment_time
        ).first()


        if old_availability:
            old_availability.is_available = True
            old_availability.save()



        # ocupar nuevo horario

        new_availability.is_available = False
        new_availability.save()



        # actualizar cita

        appointment.appointment_date = new_date
        appointment.appointment_time = new_time
        appointment.save()



        return Response(
            {
                "detail": "Cita reprogramada correctamente"
            }
        )


class CancelAppointmentView(APIView):

    permission_classes = [IsPatient]


    def patch(self, request, pk):

        try:

            appointment = Appointment.objects.get(
                id=pk,
                patient=request.user
            )

        except Appointment.DoesNotExist:

            return Response(
                {
                    "detail": "Cita no encontrada"
                },
                status=status.HTTP_404_NOT_FOUND
            )


        if appointment.status != 'pending':

            return Response(
                {
                    "detail":
                    "Solo puedes cancelar citas pendientes."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        availability = DoctorAvailability.objects.filter(
            doctor=appointment.doctor,
            date=appointment.appointment_date,
            time=appointment.appointment_time
        ).first()


        if availability:

            availability.is_available = True
            availability.save()


        appointment.status = 'cancelled'
        appointment.save()


        return Response(
            {
                "detail":
                "Cita cancelada correctamente"
            }
        ) 

class DoctorAppointmentsView(
    generics.ListAPIView
):

    serializer_class = DoctorAppointmentSerializer

    permission_classes = [IsDoctor]

    def get_queryset(self):

        return Appointment.objects.filter(
            doctor=self.request.user
        ).order_by(
            'appointment_date',
            'appointment_time'
        )

    def get_queryset(self):

        maintain_system()

        return Appointment.objects.filter(
            doctor=self.request.user
        ).exclude(
            status='cancelled'
        ).order_by(
            'appointment_date',
            'appointment_time'
        )

class UpdateAppointmentStatusView(APIView):

    permission_classes = [IsDoctor]

    def patch(self, request, pk):

        try:

            appointment = Appointment.objects.get(
                id=pk,
                doctor=request.user
            )

        except Appointment.DoesNotExist:

            return Response(
                {"detail": "Cita no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")

        if new_status not in ["completed", "no_show"]:

            return Response(
                {"detail": "Estado inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = new_status
        appointment.save()

        return Response(
            {"detail": "Estado actualizado"}
        )

class DoctorDashboardView(APIView):

    permission_classes = [IsDoctor]

    def get(self, request):

        today = date.today()

        week_end = today + timedelta(days=7)

        appointments_today = Appointment.objects.filter(
            doctor=request.user,
            appointment_date=today
        ).exclude(
            status='cancelled'
        ).count()

        appointments_week = Appointment.objects.filter(
            doctor=request.user,
            appointment_date__range=[today, week_end]
        ).exclude(
            status='cancelled'
        ).count()

        attended_patients = Appointment.objects.filter(
            doctor=request.user,
            status='completed'
        ).count()

        return Response({
            "appointments_today": appointments_today,
            "appointments_week": appointments_week,
            "attended_patients": attended_patients
        })

class AppointmentLimitStatusView(APIView):

    permission_classes = [IsPatient]

    def get(self, request):

        patient = request.user

        if not patient.eps:

            return Response({
                "show_warning": False
            })

        try:

            config = EPSConfiguration.objects.get(
                eps_name=patient.eps
            )

        except EPSConfiguration.DoesNotExist:

            return Response({
                "show_warning": False
            })

        appointments = Appointment.objects.filter(
            patient=patient
        ).exclude(
            status='cancelled'
        )

        used = appointments.count()

        remaining = max(
            config.appointment_limit - used,
            0
        )

        return Response({

            "limit": config.appointment_limit,

            "used": used,

            "remaining": remaining,

            "show_warning": remaining <= 2,

            "blocked": remaining == 0

        })