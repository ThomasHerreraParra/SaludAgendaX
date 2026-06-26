from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, EPSConfiguration
from .token import CustomTokenObtainPairSerializer
from .permissions import IsAdminOrSuperAdmin

from .serializers import (
    RegisterSerializer,
    UserSummarySerializer,
    AssignSpecialtySerializer,
    UpdateProfileSerializer,
    EPSConfigurationSerializer
)


class RegisterView(generics.CreateAPIView):
    """HU-1: Registro de usuarios"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class CustomLoginView(TokenObtainPairView):
    """HU-2: Login con JWT + rol en token"""
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """Perfil del usuario autenticado"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSummarySerializer(request.user)
        return Response(serializer.data)

class UpdateProfileView(
    generics.UpdateAPIView
):

    serializer_class = UpdateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):

        return self.request.user


# ─── Vistas Administrativas (HU-11, HU-12) ───────────────────────────────────

class UserListView(generics.ListAPIView):
    """Lista usuarios filtrable por rol"""
    serializer_class = UserSummarySerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):
        qs = User.objects.all().order_by('-date_joined')
        role = self.request.query_params.get('role')
        active = self.request.query_params.get('active')
        if role:
            qs = qs.filter(role=role)
        if active is not None:
            qs = qs.filter(is_active=active.lower() == 'true')
        return qs

class DoctorListBySpecialtyView(generics.ListAPIView):
    """
    HU-4: Obtener médicos por especialidad para solicitud de citas
    """
    serializer_class = UserSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = User.objects.filter(
            role='doctor',
            is_active=True
        )

        specialty = self.request.query_params.get('specialty')

        if specialty:
            qs = qs.filter(specialty_id=specialty)

        return qs

class DeactivatePatientView(APIView):
    """HU-11: Desactivar paciente (soft delete)"""
    permission_classes = [IsAdminOrSuperAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='patient')
        except User.DoesNotExist:
            return Response({'detail': 'Paciente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = False
        user.save()
        return Response({'detail': f'Paciente {user.username} desactivado correctamente.'})


class ReactivatePatientView(APIView):
    """Reactivar paciente"""
    permission_classes = [IsAdminOrSuperAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='patient')
        except User.DoesNotExist:
            return Response({'detail': 'Paciente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = True
        user.save()
        return Response({'detail': f'Paciente {user.username} reactivado correctamente.'})


class DeactivateDoctorView(APIView):
    """HU-12: Desactivar médico"""
    permission_classes = [IsAdminOrSuperAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='doctor')
        except User.DoesNotExist:
            return Response({'detail': 'Médico no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = False
        user.save()
        return Response({'detail': f'Médico {user.username} desactivado correctamente.'})


class AssignSpecialtyView(APIView):
    """HU-10: Asignar especialidad a un médico"""
    permission_classes = [IsAdminOrSuperAdmin]

    def patch(self, request, pk):
        try:
            doctor = User.objects.get(pk=pk, role='doctor')
        except User.DoesNotExist:
            return Response({'detail': 'Médico no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignSpecialtySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        from specialties.models import Specialty
        specialty = Specialty.objects.get(pk=serializer.validated_data['specialty_id'])
        doctor.specialty = specialty
        doctor.save()


        from appointments.utils import generate_doctor_schedule

        generate_doctor_schedule(doctor)

        return Response({
            'detail': f'Especialidad "{specialty.name}" asignada al médico {doctor.username}.',
            'doctor_id': doctor.id,
            'specialty_id': specialty.id,
            'specialty_name': specialty.name,
        })


class ReactivateDoctorView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def patch(self, request, pk):
        try:
            doctor = User.objects.get(pk=pk, role='doctor')
        except User.DoesNotExist:
            return Response(
                {"detail": "Médico no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        doctor.is_active = True
        doctor.save()

        return Response(
            {"detail": "Doctor reactivado correctamente."},
            status=status.HTTP_200_OK
        )

class EPSConfigurationListView(generics.ListAPIView):
    """
    HU-13 / HU-14
    Lista las configuraciones de todas las EPS.
    """

    serializer_class = EPSConfigurationSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):

        # Obtener todas las EPS distintas registradas por pacientes
        eps_list = (
            User.objects
            .exclude(eps__isnull=True)
            .exclude(eps="")
            .values_list("eps", flat=True)
            .distinct()
        )

        # Crear automáticamente la configuración si no existe
        for eps in eps_list:

            EPSConfiguration.objects.get_or_create(
                eps_name=eps
            )

        return EPSConfiguration.objects.all().order_by("eps_name")


class EPSConfigurationUpdateView(generics.UpdateAPIView):
    """
    HU-13 / HU-14
    Actualiza presupuesto y tope de citas.
    """

    queryset = EPSConfiguration.objects.all()
    serializer_class = EPSConfigurationSerializer
    permission_classes = [IsAdminOrSuperAdmin]