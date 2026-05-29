// src/pages/DashboardSuperAdmin.jsx
// HU-19: Panel del Superadministrador — acceso total al sistema

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MODULES = [
  {
    icon: '🏥',
    title: 'Gestión administrativa',
    desc: 'Accede a pacientes, médicos y especialidades',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
  },
  {
    icon: '💰',
    title: 'Presupuestos EPS',
    desc: 'Define presupuestos máximos por EPS',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    coming: true,
  },
  {
    icon: '🎯',
    title: 'Topes de citas',
    desc: 'Configura el número máximo de citas por EPS',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    coming: true,
  },
  {
    icon: '⚙️',
    title: 'Configuración global',
    desc: 'Horarios, sedes, feriados y parámetros del sistema',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
    coming: true,
  },
  {
    icon: '📊',
    title: 'Reportes',
    desc: 'Estadísticas globales del sistema de salud',
    color: 'bg-rose-50 border-rose-100',
    iconBg: 'bg-rose-100',
    coming: true,
  },
  {
    icon: '🔔',
    title: 'Notificaciones',
    desc: 'Parámetros de alertas y notificaciones automáticas',
    color: 'bg-yellow-50 border-yellow-100',
    iconBg: 'bg-yellow-100',
    coming: true,
  },
]

const DashboardSuperAdmin = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) navigate('/login')
    if (role && role !== 'superadmin') navigate(`/dashboard/${role}`)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} username={username} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span>🛡️</span> Superadministrador
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Control total del sistema
          </h1>
          <p className="text-slate-500 mt-1">Gestiona todas las configuraciones y parámetros globales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(({ icon, title, desc, color, iconBg, coming }) => (
            <div
              key={title}
              onClick={() => {
                if (title === 'Gestión administrativa') navigate('/dashboard/admin')
              }}
              className={`rounded-2xl border p-6 transition-all duration-200 relative ${color} ${
                !coming ? 'cursor-pointer hover:shadow-md' : 'opacity-80'
              }`}
            >
              {coming && (
                <span className="absolute top-3 right-3 text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  Sprint 2+
                </span>
              )}
              <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                {icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default DashboardSuperAdmin
