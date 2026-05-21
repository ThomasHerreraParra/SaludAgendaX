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