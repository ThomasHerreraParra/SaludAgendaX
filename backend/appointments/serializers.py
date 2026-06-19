from rest_framework import serializers
from .models import Appointment, DoctorAvailability
from datetime import date


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
            'doctor_name',
            'specialty_name',
            'appointment_date',
            'appointment_time',
            'status',
        )