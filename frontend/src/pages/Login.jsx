// Login.jsx
// Página de inicio de sesión de SaludAgendaX
// Se conecta al endpoint POST /api/users/login/
// Redirige al dashboard correspondiente según el rol del usuario

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

const Login = () => {
  // Estados para los campos del formulario
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Estado para mostrar errores al usuario
  const [error, setError] = useState('')

  // Estado para deshabilitar el botón mientras se procesa
  const [loading, setLoading] = useState(false)

  // Hook para redirigir a otra página
  const navigate = useNavigate()

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Llama al backend con usuario y contraseña
      const data = await loginUser(username, password)

      // Guarda el token JWT y el rol en localStorage
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)

      // Redirige según el rol del usuario
      if (data.role === 'patient') navigate('/dashboard/patient')
      else if (data.role === 'doctor') navigate('/dashboard/doctor')
      else if (data.role === 'admin') navigate('/dashboard/admin')
      else if (data.role === 'superadmin') navigate('/dashboard/superadmin')

    } catch (err) {
      // Muestra error si las credenciales son incorrectas
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">SaludAgendaX</h1>
          <p className="text-gray-500 mt-1">Sistema de Gestión de Citas Médicas</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Campo usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Botón de login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

        </form>

        {/* Link al registro */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </a>
        </p>

      </div>
    </div>
  )
}

export default Login