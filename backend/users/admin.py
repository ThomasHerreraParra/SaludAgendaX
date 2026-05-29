from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'document', 'eps', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'eps')
    search_fields = ('username', 'email', 'document', 'first_name', 'last_name')
    ordering = ('-date_joined',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Datos adicionales', {
            'fields': ('role', 'document', 'eps', 'phone', 'specialty')
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Datos adicionales', {
            'fields': ('role', 'document', 'eps', 'phone')
        }),
    )
