// src/components/Navbar.jsx
// Barra de navegación compartida para todos los dashboards

import { Link, useNavigate } from 'react-router-dom'
import logoSaludAgenda from '../assets/Logo Salud Agenda X w.png'

const ROLE_LABELS = {
  patient: 'Paciente',
  doctor: 'Médico',
  admin: 'Administrativo',
  superadmin: 'Superadministrador',
}

const Navbar = ({ role, username }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')

    navigate('/', { replace: true })

    window.location.reload()
  }

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30" >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
            <img
              src={logoSaludAgenda}
              alt="Logo SaludAgendaX"
              className="w-16 h-16 object-contain"
            />
          </div>

          <span className="text-slate-800 font-bold text-lg">
            SaludAgendaX
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{username}</p>
            <p className="text-xs text-slate-400">{ROLE_LABELS[role] || role}</p>
          </div>
          <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-teal-700 font-bold text-sm">
              {username?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
