from rest_framework import serializers
from .models import Specialty


class SpecialtySerializer(serializers.ModelSerializer):
    doctor_count = serializers.ReadOnlyField()

    class Meta:
        model = Specialty
        fields = ('id', 'name', 'description', 'is_active', 'doctor_count', 'created_at')
        read_only_fields = ('id', 'created_at', 'doctor_count')

    def validate_name(self, value):
        qs = Specialty.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya existe una especialidad con ese nombre.")
        return value
