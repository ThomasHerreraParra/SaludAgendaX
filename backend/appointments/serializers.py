from rest_framework import serializers
from .models import Appointment, DoctorAvailability
from datetime import date
from users.models import EPSConfiguration


class DoctorAvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = DoctorAvailability
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = (
            'id',
            'doctor',
            'specialty',
            'appointment_date',
            'appointment_time',
            'status',
            'created_at',
        )

    def validate(self, data):

        appointment_date = data.get('appointment_date')

        if appointment_date < date.today():
            raise serializers.ValidationError(
                "No puedes solicitar citas en fechas pasadas."
            )


        doctor = data.get('doctor')
        appointment_time = data.get('appointment_time')

        patient = self.context['request'].user
        try:

            eps_config = EPSConfiguration.objects.get(
                eps_name=patient.eps
            )

        except EPSConfiguration.DoesNotExist:

            eps_config = None

        if eps_config and eps_config.appointment_limit > 0:
            total_appointments = Appointment.objects.filter(
                patient__eps=patient.eps
            ).exclude(
                status='cancelled'
            ).count()

            if total_appointments >= eps_config.appointment_limit:

                raise serializers.ValidationError(
                    "La EPS alcanzó el número máximo de citas permitidas."
                )

        if eps_config and eps_config.budget_limit > 0:

            appointments = Appointment.objects.filter(
                patient__eps=patient.eps
            ).exclude(
                status='cancelled'
            )

            total_budget = sum(
                appointment.specialty.appointment_cost
                for appointment in appointments
            )

            projected_budget = (
                total_budget +
                data['specialty'].appointment_cost
            )

            if projected_budget > eps_config.budget_limit:

                raise serializers.ValidationError(
                    "La EPS superó el presupuesto disponible."
                )

        exists = DoctorAvailability.objects.filter(
            doctor=doctor,
            date=appointment_date,
            time=appointment_time,
            is_available=True
        ).exists()


        if not exists:
            raise serializers.ValidationError(
                "El horario seleccionado ya no está disponible."
            )


        return data

class CreateAvailabilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = DoctorAvailability
        fields = (
            'id',
            'date',
            'time',
            'is_available'
        )

    def validate_date(self, value):

        if value < date.today():
            raise serializers.ValidationError(
                "No puedes crear horarios en fechas pasadas."
            )

        return value

class MyAppointmentSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source='doctor.username'
    )

    specialty_name = serializers.CharField(
        source='specialty.name'
    )


    class Meta:

        model = Appointment

        fields = (
            'id',
            'doctor',
            'doctor_name',
            'specialty_name',
            'appointment_date',
            'appointment_time',
            'status',
        )

class DoctorAppointmentSerializer(
    serializers.ModelSerializer
):

    patient_name = serializers.CharField(
        source='patient.username'
    )

    specialty_name = serializers.CharField(
        source='specialty.name'
    )

    class Meta:

        model = Appointment

        fields = (
            'id',
            'patient_name',
            'specialty_name',
            'appointment_date',
            'appointment_time',
            'status'
        )

class DoctorScheduleSerializer(serializers.ModelSerializer):

    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = DoctorAvailability
        fields = (
            'id',
            'date',
            'time',
            'is_available',
            'patient_name'
        )

    def get_patient_name(self, obj):

        appointment = Appointment.objects.filter(
            doctor=obj.doctor,
            appointment_date=obj.date,
            appointment_time=obj.time
        ).exclude(
            status='cancelled'
        ).first()

        if appointment:
            return appointment.patient.username

        return None

class DoctorDashboardSerializer(serializers.Serializer):

    appointments_today = serializers.IntegerField()

    appointments_week = serializers.IntegerField()

    attended_patients = serializers.IntegerField()