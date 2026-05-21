from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = (
        ('patient', 'Paciente'),
        ('doctor', 'Medico'),
        ('admin', 'Administrativo'),
        ('superadmin', 'Superadministrador'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    document = models.CharField(
        max_length=20,
        unique=True
    )

    eps = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )