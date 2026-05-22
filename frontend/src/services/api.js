// api.js
// Módulo central de comunicación con el backend de SaludAgendaX
// Todas las peticiones HTTP al servidor Django pasan por aquí

import axios from 'axios'

// Instancia base de axios configurada con la URL del backend
// Todos los endpoints se construyen a partir de esta URL base
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

/**
 * Inicia sesión de un usuario en el sistema
 * Endpoint: POST /login/
 * 
 * @param {string} username - Nombre de usuario registrado
 * @param {string} password - Contraseña del usuario
 * @returns {object} - Contiene: access (JWT), refresh (JWT), role, username
 */
export const loginUser = async (username, password) => {
  const response = await api.post('/login/', { username, password })
  return response.data
}

/**
 * Registra un nuevo usuario en el sistema
 * Endpoint: POST /api/users/register/
 * 
 * @param {object} data - Datos del usuario:
 *   - username {string} requerido
 *   - email {string} requerido
 *   - password {string} requerido
 *   - document {string} requerido - documento de identidad
 *   - role {string} requerido - patient | doctor | admin | superadmin
 *   - eps {string} opcional
 *   - phone {string} opcional
 * @returns {object} - Datos del usuario creado
 */
export const registerUser = async (data) => {
  const response = await api.post('/register/', data)
  return response.data
}

export default api