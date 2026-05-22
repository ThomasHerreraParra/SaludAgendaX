// Register.jsx
// Página de registro de usuarios para SaludAgendaX
// Diseño moderno tipo SaaS inspirado en la referencia enviada
// Mantiene la misma identidad visual del Login.jsx
// Estructura:
// - Panel izquierdo → imagen + texto decorativo
// - Panel derecho → formulario de registro

// Hook para manejar estados
import { useState } from 'react'

// Hook para navegar entre rutas
import { useNavigate } from 'react-router-dom'

import { registerUser } from '../services/api'

const Register = () => {

  // Hook para redireccionar entre páginas
  const navigate = useNavigate()

  // ==============================
  // ESTADOS DEL FORMULARIO
  // ==============================

  // Estado principal que guarda todos los datos del usuario
  const [formData, setFormData] = useState({

    // Nombre de usuario
    username: '',

    // Correo electrónico
    email: '',

    // Contraseña
    password: '',

    // Documento de identidad
    document_number: '',

    // Rol del usuario
    role: 'patient',

    // EPS del usuario (opcional)
    eps: '',

    // Teléfono del usuario (opcional)
    phone: ''
  })

  // Estado para mostrar loading mientras se procesa
  const [loading, setLoading] = useState(false)

  // Estado para mostrar errores
  const [error, setError] = useState('')

  // ==============================
  // FUNCIÓN PARA ACTUALIZAR INPUTS
  // ==============================

  // Esta función actualiza automáticamente el campo
  // que el usuario esté escribiendo
  const handleChange = (e) => {

    setFormData({

      // Mantiene los datos anteriores
      ...formData,

      // Actualiza SOLO el input modificado
      [e.target.name]: e.target.value
    })
  }

  // ==============================
  // ENVÍO DEL FORMULARIO
  // ==============================

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    // Construye el objeto con los datos del formulario
    // El backend espera 'document' no 'document_number'
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      document: formData.document_number,
      role: formData.role,
      ...(formData.eps && { eps: formData.eps }),
      ...(formData.phone && { phone: formData.phone }),
    }

    // Llama al backend para registrar el usuario
    await registerUser(data)

    // Redirige al login si fue exitoso
    navigate('/login')

  } catch (err) {
    // Muestra el error que devuelve el backend
    const errData = err.response?.data
    if (errData) {
      const firstError = Object.values(errData)[0]
      setError(Array.isArray(firstError) ? firstError[0] : firstError)
    } else {
      setError('Error al crear la cuenta')
    }
  } finally {
    setLoading(false)
  }
}

  // ==============================
  // RENDER DEL COMPONENTE
  // ==============================

  return (

    // Contenedor principal
    // Pantalla completa centrada
    // Fondo blanco como el login
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ backgroundColor: '#ffffff' }}
    >

      {/* ================================================= */}
      {/* CARD PRINCIPAL */}
      {/* ================================================= */}

      <div
        className="
          w-full
          max-w-6xl
          bg-white
          rounded-3xl
          overflow-hidden
          shadow-xl
          border
          border-gray-100
          flex
        "

        // Altura mínima
        style={{ minHeight: '760px' }}
      >

        {/* ================================================= */}
        {/* PANEL IZQUIERDO */}
        {/* Imagen + decoración */}
        {/* ================================================= */}

        <div
          className="
            hidden
            md:flex
            flex-1
            relative
            bg-gray-50
            items-center
            justify-center
          "
        >

          {/* Decoración de puntos */}
          <div
            className="
              absolute
              top-16
              right-20
              grid
              grid-cols-10
              gap-3
              opacity-40
            "
          >

            {
              // Genera automáticamente 120 punticos decorativos
              Array.from({ length: 120 }).map((_, index) => (

                <div
                  key={index}
                  className="
                    w-1.5
                    h-1.5
                    bg-cyan-300
                    rounded-full
                  "
                />

              ))
            }

          </div>

          {/* ================================= */}
          {/* IMAGEN CIRCULAR */}
          {/* ================================= */}

          <div className="relative z-10">

            {/* Contenedor circular */}
            <div
              className="
                w-[420px]
                h-[420px]
                rounded-full
                overflow-hidden
                shadow-2xl
                border-8
                border-white
              "
            >

              {/* Imagen */}
              <img
                src="/src/assets/registerimagen.jpg"
                alt="Registro"

                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            </div>

          </div>

          {/* ================================= */}
          {/* TEXTO INFERIOR */}
          {/* ================================= */}

          <div className="absolute bottom-16 left-16">

            <h2
              className="
                text-4xl
                font-semibold
                text-gray-800
                mb-4
              "
            >
              Únete a SaludAgendaX
            </h2>

            <p
              className="
                text-gray-500
                max-w-md
                leading-relaxed
              "
            >
              Gestiona tus citas médicas de manera rápida,
              segura y eficiente desde cualquier lugar.
            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* PANEL DERECHO */}
        {/* FORMULARIO */}
        {/* ================================================= */}

        <div
          className="
            flex-1
            bg-white
            px-10
            py-12
            flex
            flex-col
            justify-center
          "
        >

          {/* ================================= */}
          {/* ENCABEZADO */}
          {/* ================================= */}

          <div className="mb-8">

            <h1
              className="
                text-4xl
                font-bold
                text-cyan-700
                mb-2
              "
            >
              Crear cuenta
            </h1>

            <p className="text-gray-500">
              Completa tus datos para registrarte
            </p>

          </div>

          {/* ================================= */}
          {/* FORMULARIO */}
          {/* ================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ================================= */}
            {/* INPUT USUARIO */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Usuario
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                required

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  placeholder-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              />

            </div>

            {/* ================================= */}
            {/* INPUT EMAIL */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  placeholder-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              />

            </div>

            {/* ================================= */}
            {/* INPUT PASSWORD */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  placeholder-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              />

            </div>

            {/* ================================= */}
            {/* INPUT DOCUMENTO */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Documento de identidad
              </label>

              <input
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                placeholder="Número de documento"
                required

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  placeholder-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              />

            </div>

            {/* ================================= */}
            {/* SELECT ROL */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Rol
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              >

                <option value="patient">
                  Paciente
                </option>

                <option value="doctor">
                  Doctor
                </option>

              </select>

            </div>

            {/* ================================= */}
            {/* INPUT EPS */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                EPS

                <span
                  className="
                    text-gray-400
                    text-xs
                    ml-1
                  "
                >
                  (opcional)
                </span>

              </label>

              <input
                type="text"
                name="eps"
                value={formData.eps}
                onChange={handleChange}
                placeholder="Nombre de tu EPS"

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  placeholder-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              />

            </div>

            {/* ================================= */}
            {/* INPUT TELÉFONO */}
            {/* ================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Teléfono

                <span
                  className="
                    text-gray-400
                    text-xs
                    ml-1
                  "
                >
                  (opcional)
                </span>

              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Número de teléfono"

                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  text-gray-700
                  placeholder-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  transition
                "
              />

            </div>

            {/* ================================= */}
            {/* MENSAJE DE ERROR */}
            {/* ================================= */}

            {
              error && (

                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>

              )
            }

            {/* ================================= */}
            {/* BOTÓN REGISTRO */}
            {/* ================================= */}

            <button
              type="submit"
              disabled={loading}

              className="
                w-full
                bg-cyan-600
                hover:bg-cyan-700
                text-white
                font-semibold
                py-3
                rounded-xl
                transition
                duration-200
                disabled:opacity-50
                shadow-md
              "
            >

              {
                loading
                  ? 'Creando cuenta...'
                  : 'Crear cuenta'
              }

            </button>

          </form>

          {/* ================================= */}
          {/* LINK LOGIN */}
          {/* ================================= */}

          <p
            className="
              text-center
              text-gray-500
              text-sm
              mt-8
            "
          >

            ¿Ya tienes cuenta?

            <span
              onClick={() => navigate('/login')}

              className="
                text-cyan-700
                font-medium
                cursor-pointer
                hover:underline
                ml-1
              "
            >
              Inicia sesión aquí
            </span>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Register