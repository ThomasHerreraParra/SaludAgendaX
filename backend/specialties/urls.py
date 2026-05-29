from django.urls import path
from .views import SpecialtyListCreateView, SpecialtyDetailView

urlpatterns = [
    path('', SpecialtyListCreateView.as_view(), name='specialty-list-create'),
    path('<int:pk>/', SpecialtyDetailView.as_view(), name='specialty-detail'),
]
