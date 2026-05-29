// src/pages/DashboardDoctor.jsx
// HU-19: Panel del médico

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MENU_ITEMS = [
  {
    icon: '📆',
    title: 'Mi agenda',
    desc: 'Consulta tus franjas horarias y disponibilidad',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
  },
  {
    icon: '👥',
    title: 'Mis citas',
    desc: 'Lista de citas asignadas con datos de los pacientes',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🏷️',
    title: 'Mi especialidad',
    desc: 'Consulta la especialidad asignada a tu perfil',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '👤',
    title: 'Mi perfil',
    desc: 'Datos de tu cuenta y configuración personal',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
  },
]

const DashboardDoctor = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) navigate('/login')
    if (role && role !== 'doctor') navigate(`/dashboard/${role}`)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} username={username} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-800">
            Hola, Dr. <span className="text-teal-600">{username}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Panel médico — consulta tu agenda y citas asignadas</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Citas hoy', value: '—', color: 'text-teal-600' },
            { label: 'Citas esta semana', value: '—', color: 'text-blue-600' },
            { label: 'Pacientes atendidos', value: '—', color: 'text-purple-600' },
            { label: 'Especialidad', value: '—', color: 'text-orange-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Acciones disponibles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MENU_ITEMS.map(({ icon, title, desc, color, iconBg }) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 cursor-pointer hover:shadow-md transition-all duration-200 ${color}`}
            >
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

export default DashboardDoctor
