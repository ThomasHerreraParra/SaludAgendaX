// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import loginBanner from '../assets/loginbannerderecho.jpg'

const ROLE_ROUTES = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  admin: '/dashboard/admin',
  superadmin: '/dashboard/superadmin',
}

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await login(form.username, form.password)
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)

      const route = ROLE_ROUTES[data.role] || '/dashboard/patient'
      navigate(route)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Credenciales incorrectas. Verifica tu usuario y contraseña.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Panel izquierdo — imagen con overlay */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">

        {/* Imagen de fondo */}
        <img
          src={loginBanner}
          alt="SaludAgendaX"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay oscuro para contraste */}
        <div className="absolute inset-0 bg-teal-900/70" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">SaludAgendaX</span>
          </div>
        </div>

        {/* Texto central */}
        <div className="relative z-10">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
            Gestión médica<br />inteligente y segura
          </h2>
          <p className="text-teal-100 text-lg drop-shadow">
            Agenda citas, gestiona pacientes y médicos desde un solo lugar.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="relative z-10 flex gap-8">
          {[
            { label: 'Pacientes', value: '—' },
            { label: 'Médicos', value: '—' },
            { label: 'EPS soportadas', value: '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-white text-3xl font-bold drop-shadow">{value}</div>
              <div className="text-teal-200 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo móvil */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">+</span>
            </div>
            <span className="text-slate-800 text-xl font-bold">SaludAgendaX</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">Bienvenido de nuevo</h1>
          <p className="text-slate-500 mb-8">Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm flex items-start gap-3">
              <span className="text-red-400 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Tu nombre de usuario"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login