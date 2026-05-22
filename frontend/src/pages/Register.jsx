// Register.jsx
// Página de registro de nuevos usuarios en SaludAgendaX
// Se conecta al endpoint POST /api/register/
// Permite registrar pacientes, médicos, administrativos y superadministradores

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

const Register = () => {
  // Estados para cada campo del formulario
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [document, setDocument] = useState('')
  const [role, setRole] = useState('patient') // Rol por defecto: paciente
  const [eps, setEps] = useState('')
  const [phone, setPhone] = useState('')

  // Estado para mostrar errores al usuario
  const [error, setError] = useState('')

  // Estado para mostrar mensaje de éxito
  const [success, setSuccess] = useState('')

  // Estado para deshabilitar el botón mientras se procesa
  const [loading, setLoading] = useState(false)

  // Hook para redirigir a otra página
  const navigate = useNavigate()

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Construye el objeto con los datos del formulario
      const data = {
        username,
        email,
        password,
        document,
        role,
        // eps y phone son opcionales, solo se envían si tienen valor
        ...(eps && { eps }),
        ...(phone && { phone }),
      }

      // Llama al backend con los datos del formulario
      await registerUser(data)

      // Muestra mensaje de éxito y redirige al login después de 2 segundos
      setSuccess('Usuario registrado correctamente. Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 2000)

    } catch (err) {
      // Muestra el error que devuelve el backend (ej: email ya registrado)
      const errData = err.response?.data
      if (errData) {
        // Toma el primer error que devuelva el backend
        const firstError = Object.values(errData)[0]
        setError(Array.isArray(firstError) ? firstError[0] : firstError)
      } else {
        setError('Error al registrar. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">SaludAgendaX</h1>
          <p className="text-gray-500 mt-1">Crear nueva cuenta</p>
        </div>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-4">

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

          {/* Campo email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
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

          {/* Campo documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento de identidad
            </label>
            <input
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Número de documento"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">Paciente</option>
              <option value="doctor">Médico</option>
              <option value="admin">Administrativo</option>
              <option value="superadmin">Superadministrador</option>
            </select>
          </div>

          {/* Campo EPS - opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EPS <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={eps}
              onChange={(e) => setEps(e.target.value)}
              placeholder="Nombre de tu EPS"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo teléfono - opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Número de teléfono"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>

        </form>

        {/* Link al login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión aquí
          </a>
        </p>

      </div>
    </div>
  )
}

export default Register