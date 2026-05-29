from django.urls import path
from .views import (
    RegisterView,
    CustomLoginView,
    MeView,
    UserListView,
    DeactivatePatientView,
    ReactivatePatientView,
    DeactivateDoctorView,
    AssignSpecialtyView,
)

urlpatterns = [
    # Autenticación
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),

    # Administración de usuarios
    path('users/', UserListView.as_view(), name='user-list'),

    # HU-11: Gestión de pacientes
    path('users/patients/<int:pk>/deactivate/', DeactivatePatientView.as_view(), name='deactivate-patient'),
    path('users/patients/<int:pk>/reactivate/', ReactivatePatientView.as_view(), name='reactivate-patient'),

    # HU-12: Gestión de médicos
    path('users/doctors/<int:pk>/deactivate/', DeactivateDoctorView.as_view(), name='deactivate-doctor'),

    # HU-10: Asignar especialidad
    path('users/doctors/<int:pk>/assign-specialty/', AssignSpecialtyView.as_view(), name='assign-specialty'),
]
