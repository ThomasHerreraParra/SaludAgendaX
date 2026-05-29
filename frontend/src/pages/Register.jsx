// src/pages/Register.jsx
import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import registerImagen from '../assets/registerimagen.jpg'

const EPS_LIST = [
  'Sura', 'Sanitas', 'Nueva EPS', 'Compensar', 'Coosalud',
  'Famisanar', 'Salud Total', 'Aliansalud', 'Comfenalco', 'Mutual Ser',
]

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    document: '',
    phone: '',
    eps: '',
    password: '',
    confirm_password: '',
    role: 'patient',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // useCallback evita que el componente Field se re-renderice
  // y pierda el foco en cada pulsación de tecla
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((er) => ({ ...er, [name]: null }))
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!form.username.trim()) newErrors.username = 'El usuario es requerido'
    if (!form.first_name.trim()) newErrors.first_name = 'El nombre es requerido'
    if (!form.last_name.trim()) newErrors.last_name = 'El apellido es requerido'
    if (!form.email.trim()) newErrors.email = 'El correo es requerido'
    if (!form.document.trim()) newErrors.document = 'El documento es requerido'
    if (!form.eps) newErrors.eps = 'Selecciona tu EPS'
    if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = 'Las contraseñas no coinciden'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const { confirm_password, ...payload } = form
      await register(payload)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const data = err.response?.data || {}
      const mapped = {}
      Object.entries(data).forEach(([key, val]) => {
        mapped[key] = Array.isArray(val) ? val[0] : val
      })
      setErrors(mapped)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center max-w-sm">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Registro exitoso!</h2>
          <p className="text-slate-500">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Panel izquierdo — imagen */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden">
        <img
          src={registerImagen}
          alt="Registro SaludAgendaX"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/65" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">SaludAgendaX</span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-tight mb-4 drop-shadow-lg">
            Únete a nuestra<br />red de salud
          </h2>
          <p className="text-teal-100 text-base drop-shadow">
            Registra tu cuenta y agenda citas médicas de forma fácil y rápida.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-teal-200 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white font-semibold underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-xl py-8">

          {/* Botón de regreso — arriba a la izquierda */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-6 group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-medium">Volver al inicio de sesión</span>
          </button>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Crear cuenta</h1>
          <p className="text-slate-500 mb-8">Completa tus datos para registrarte como paciente</p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Datos personales */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Datos personales
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="Juan"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.first_name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Apellido <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Pérez"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.last_name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre de usuario <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="juanperez"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.username ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Documento <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="document"
                    value={form.document}
                    onChange={handleChange}
                    placeholder="123456789"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.document ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="300 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    EPS <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="eps"
                    value={form.eps}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.eps ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <option value="">Selecciona tu EPS</option>
                    {EPS_LIST.map((eps) => (
                      <option key={eps} value={eps}>{eps}</option>
                    ))}
                  </select>
                  {errors.eps && <p className="text-red-500 text-xs mt-1">{errors.eps}</p>}
                </div>

              </div>
            </div>

            {/* Datos de acceso */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Datos de acceso
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Correo electrónico <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="juan@email.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Contraseña <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirmar contraseña <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.confirm_password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                </div>

              </div>
            </div>

            {/* Rol fijo como paciente */}
            <input type="hidden" name="role" value="patient" />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear cuenta como paciente'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Register