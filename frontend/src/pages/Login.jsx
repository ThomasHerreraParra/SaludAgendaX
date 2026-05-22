// Login.jsx
// Página de inicio de sesión de SaludAgendaX
// Se conecta al endpoint POST /api/users/login/
// Redirige al dashboard correspondiente según el rol del usuario
// Diseño: dos columnas — formulario izquierda, panel de color derecha

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
    // Fondo blanco, pantalla completa, centrado
     // Fondo blanco puro en toda la página
<div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#ffffff'}}>
  <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg border border-gray-100" style={{minHeight: '500px'}}>
    
        {/* Columna izquierda — formulario */}
        <div className="flex-1 bg-white px-12 py-16 flex flex-col justify-center">

          {/* Encabezado */}
          <p className="text-sm text-gray-400 mb-1">Sistema de Gestión de Citas Médicas</p>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">SaludAgendaX</h1>
          <p className="text-gray-500 mb-8">Bienvenido, ingresa a tu cuenta</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Campo usuario */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Campo contraseña */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-teal-800 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            {/* Botón crear cuenta */}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-white border border-gray-00 hover:bg-gray-50 text-gray-500 font-medium py-2.5 rounded-lg transition duration-200"
            >
              Crear cuenta
            </button>

          </form>

          {/* Pie de página */}
          <p className="text-xs text-gray-300 text-center mt-8">
            Universidad del Valle · Ingeniería de Sistemas
          </p>

        </div>

        {/* Columna derecha — imagen médica, ocupa toda la altura */}
<div className="flex-1 relative">
  <img
    src="/src/assets/loginbannerderecho.jpg"
    alt="Imagen médica"
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center'}}
/>
</div>

      </div>
    </div>
  )
}

export default Login