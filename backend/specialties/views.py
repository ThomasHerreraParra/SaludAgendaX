from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Specialty
from .serializers import SpecialtySerializer
from users.permissions import IsAdmin, IsSuperAdmin


class IsAdminOrSuperAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ('admin', 'superadmin')


class SpecialtyListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/specialties/       → Lista todas las especialidades activas
    POST /api/specialties/       → Crea una nueva especialidad (admin/superadmin)
    """
    queryset = Specialty.objects.filter(is_active=True)
    serializer_class = SpecialtySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminOrSuperAdmin()]


class SpecialtyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/specialties/<id>/  → Detalle de especialidad
    PUT    /api/specialties/<id>/  → Actualizar especialidad
    DELETE /api/specialties/<id>/  → Desactivar especialidad (soft delete)
    """
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(
            {'detail': 'Especialidad desactivada correctamente.'},
            status=status.HTTP_200_OK
        )
