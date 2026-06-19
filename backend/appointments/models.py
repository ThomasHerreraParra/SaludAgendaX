from django.db import models
from users.models import User
from specialties.models import Specialty


class Appointment(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('approved', 'Aprobada'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
    )

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments'
    )

    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_appointments'
    )

    specialty = models.ForeignKey(
        Specialty,
        on_delete=models.CASCADE
    )

    appointment_date = models.DateField()

    appointment_time = models.TimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.patient.username} - "
            f"{self.doctor.username} - "
            f"{self.appointment_date}"
        )


class DoctorAvailability(models.Model):

    doctor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )

    date = models.DateField()

    time = models.TimeField()

    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('doctor', 'date', 'time')

    def __str__(self):
        return (
            f"{self.doctor.username} - "
            f"{self.date} {self.time}"
        )