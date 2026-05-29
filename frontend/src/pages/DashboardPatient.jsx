// src/pages/DashboardPatient.jsx
// HU-19: Panel del paciente con acceso a recursos disponibles para su rol

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MENU_ITEMS = [
  {
    icon: '📅',
    title: 'Solicitar cita',
    desc: 'Agenda una nueva cita con el especialista que necesitas',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
    coming: true,
  },
  {
    icon: '🗂️',
    title: 'Mis citas',
    desc: 'Consulta y gestiona tus citas activas y pasadas',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    coming: true,
  },
  {
    icon: '📋',
    title: 'Historial',
    desc: 'Revisa el historial completo de tus consultas médicas',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    coming: true,
  },
  {
    icon: '👤',
    title: 'Mi perfil',
    desc: 'Actualiza tus datos de contacto e información personal',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
    coming: true,
  },
]

const DashboardPatient = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) navigate('/login')
    if (role && role !== 'patient') navigate(`/dashboard/${role}`)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} username={username} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Saludo */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-800">
            Hola, <span className="text-teal-600">{username}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">¿Qué deseas hacer hoy?</p>
        </div>

        {/* Resumen rápido */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Citas pendientes', value: '—', color: 'text-teal-600' },
            { label: 'Citas completadas', value: '—', color: 'text-blue-600' },
            { label: 'Citas disponibles (EPS)', value: '—', color: 'text-purple-600' },
            { label: 'Próxima cita', value: '—', color: 'text-orange-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Acciones disponibles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MENU_ITEMS.map(({ icon, title, desc, color, iconBg, coming }) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 cursor-pointer hover:shadow-md transition-all duration-200 ${color} relative`}
            >
              {coming && (
                <span className="absolute top-3 right-3 text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  Próximamente
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

export default DashboardPatient
