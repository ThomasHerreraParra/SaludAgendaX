from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'username',
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
            raise serializers.ValidationError(
                "El correo ya está registrado"
            )

        return value

    def validate_document(self, value):

        if User.objects.filter(document=value).exists():
            raise serializers.ValidationError(
                "El documento ya está registrado"
            )

        return value

    def validate_role(self, value):

        valid_roles = [
            'patient',
            'doctor',
            'admin',
            'superadmin'
        ]

        if value not in valid_roles:
            raise serializers.ValidationError(
                "Rol inválido"
            )

        return value

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            document=validated_data['document'],
            eps=validated_data.get('eps'),
            phone=validated_data.get('phone'),
            role=validated_data['role']
        )

        return user