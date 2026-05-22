// Dashboard.jsx
// Dashboard temporal mientras se desarrolla el frontend completo
// Muestra el usuario autenticado y un mensaje de construcción

import { useNavigate } from 'react-router-dom'
import snoopy from '../assets/Snoopy_trabajando.jpg'

const DashboardPatient = () => {
  const username = localStorage.getItem('username')
  const role = localStorage.getItem('role')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-blue-700">
        Bienvenido, {username} 👋
      </h1>
      <p className="text-gray-500 text-lg">Rol: {role}</p>
      <h2 className="text-2xl font-semibold text-gray-600">
         Frontend y Backend en desarrollo , paciencia por favor
      </h2>
      <img src={snoopy} alt="Snoopy trabajando" className="w-64 rounded-xl shadow-lg" />
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default DashboardPatient

