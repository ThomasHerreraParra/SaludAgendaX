from django.urls import path
from .views import (
    RegisterView,
    CustomLoginView,
    MeView,
    UserListView,
    DoctorListBySpecialtyView,
    DeactivatePatientView,
    ReactivatePatientView,
    DeactivateDoctorView,
    AssignSpecialtyView,
    UpdateProfileView,
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

    #HU-4 SENORES ESTOY CANSADO DE ESTA MONDA ME DA ERROR POR TO LADO >|<
    path('doctors/', DoctorListBySpecialtyView.as_view(), name='doctor-list'),

    #HU-3
    path('me/update/', UpdateProfileView.as_view(), name='update-profile'),

]
