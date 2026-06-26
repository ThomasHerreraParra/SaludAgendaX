from django.db import models


class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    appointment_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Especialidad'
        verbose_name_plural = 'Especialidades'
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def doctor_count(self):
        return self.doctors.filter(is_active=True).count()
