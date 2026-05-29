from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import RegisterSerializer, UserSummarySerializer, AssignSpecialtySerializer
from .token import CustomTokenObtainPairSerializer
from .permissions import IsAdminOrSuperAdmin


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

        return Response({
            'detail': f'Especialidad "{specialty.name}" asignada al médico {doctor.username}.',
            'doctor_id': doctor.id,
            'specialty_id': specialty.id,
            'specialty_name': specialty.name,
        })
