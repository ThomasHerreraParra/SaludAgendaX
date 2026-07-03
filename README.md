# SaludAgendaX

SaludAgendaX es una plataforma de gestión de citas médicas diseñada para pacientes, doctores y administradores. Permite agendar y gestionar citas, administrar especialidades médicas, manejar configuraciones globales y brindar acceso mediante autenticación segura.

## Organización del proyecto

- `backend/`: API REST construida con Django y Django REST Framework.
  - `appointments/`: lógica de citas médicas.
  - `specialties/`: gestión de especialidades y costos.
  - `users/`: manejo de usuarios, autenticación y permisos.
  - `config/`: configuración del proyecto Django, rutas y despliegue.
  - `db.sqlite3`: base de datos local de desarrollo.

- `frontend/`: aplicación web React con Vite.
  - `src/`: código fuente de la interfaz.
    - `api/`: clientes para llamadas al backend.
    - `components/`: componentes reutilizables como la barra de navegación.
    - `pages/`: páginas principales del sitio.
    - `hooks/`: hooks personalizados.
    - `services/`: servicios compartidos.

## Stack tecnológico

- Backend: Python, Django, Django REST Framework
- Frontend: JavaScript, React, Vite
- Base de datos: SQLite (desarrollo)
- Autenticación: JWT / APIs seguras

## Equipo

- Daniel Micolta
- Brandon Franco
- Thomas Parra
- Felipe Muñoz
- Yoel Montoya

## Cómo empezar

1. Instalar dependencias en `backend/` y `frontend/`.
2. Ejecutar migraciones y levantar el servidor Django.
3. Iniciar la aplicación React con Vite.

