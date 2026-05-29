from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'document',
            'eps',
            'phone',
            'role'
        )

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo ya está registrado")
        return value

    def validate_document(self, value):
        if User.objects.filter(document=value).exists():
            raise serializers.ValidationError("El documento ya está registrado")
        return value

    def validate_role(self, value):
        valid_roles = ['patient', 'doctor', 'admin', 'superadmin']
        if value not in valid_roles:
            raise serializers.ValidationError("Rol inválido")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            document=validated_data['document'],
            eps=validated_data.get('eps'),
            phone=validated_data.get('phone'),
            role=validated_data['role'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class UserSummarySerializer(serializers.ModelSerializer):
    """Serializer ligero para listados administrativos"""
    specialty_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'full_name',
            'first_name',
            'last_name',
            'email',
            'document',
            'eps',
            'phone',
            'role',
            'is_active',
            'specialty',
            'specialty_name',
            'date_joined',
        )
        read_only_fields = ('id', 'date_joined')

    def get_specialty_name(self, obj):
        return obj.specialty.name if obj.specialty else None

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class AssignSpecialtySerializer(serializers.Serializer):
    """Para asignar especialidad a un médico (HU-10)"""
    specialty_id = serializers.IntegerField()

    def validate_specialty_id(self, value):
        from specialties.models import Specialty
        if not Specialty.objects.filter(pk=value, is_active=True).exists():
            raise serializers.ValidationError("Especialidad no encontrada o inactiva.")
        return value
