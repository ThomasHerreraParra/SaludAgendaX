// src/components/Navbar.jsx
// Barra de navegación compartida para todos los dashboards

import { useNavigate } from 'react-router-dom'

const ROLE_LABELS = {
  patient: 'Paciente',
  doctor: 'Médico',
  admin: 'Administrativo',
  superadmin: 'Superadministrador',
}

const Navbar = ({ role, username }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">+</span>
          </div>
          <span className="text-slate-800 font-bold text-lg">SaludAgendaX</span>
        </div>

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
