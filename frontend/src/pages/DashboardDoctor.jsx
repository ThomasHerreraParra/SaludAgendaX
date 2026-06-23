// src/pages/DashboardDoctor.jsx
// HU-19: Panel del médico

import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { getMe } from '../api/users'
import { getDoctorDashboard } from '../api/appointments'

const MENU_ITEMS = [
  {
    icon: '📆',
    title: 'Mi agenda',
    desc: 'Consulta tus franjas horarias y disponibilidad',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
    path: '/doctor/schedule'
  },
  {
    icon: '👥',
    title: 'Mis citas',
    desc: 'Lista de sus citas asignadas',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    path: '/doctor/appointments'
  },
  {
    icon: '👤',
    title: 'Mi perfil',
    desc: 'Datos de tu cuenta y configuración personal',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
    path: '/profile'

  },
]

const DashboardDoctor = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')
  const [doctorData, setDoctorData] = useState(null)

  const [stats, setStats] = useState({
    appointments_today: 0,
    appointments_week: 0,
    attended_patients: 0
  })

  useEffect(() => {

    const token = localStorage.getItem('access_token')

    loadDashboardStats()

    if (!token) {
      navigate('/login')
      return
    }

    if (role && role !== 'doctor') {
      navigate(`/dashboard/${role}`)
      return
    }

    loadDoctorData()

  }, [])

  const loadDoctorData = async () => {

    try {

      const res = await getMe()

      setDoctorData(res.data)

    } catch (error) {

      console.log(error)

    }

  }

  const loadDashboardStats = async () => {

    try {

      const res = await getDoctorDashboard()

      setStats(res.data)

    } catch (error) {

      console.log(error)

    }

  }

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
            {
              label: 'Citas hoy',
              value: stats.appointments_today,
              color: 'text-teal-600'
            },

            {
              label: 'Citas esta semana',
              value: stats.appointments_week,
              color: 'text-blue-600'
            },

            {
              label: 'Pacientes atendidos',
              value: stats.attended_patients,
              color: 'text-purple-600'
            },

            {
              label: 'Especialidad',
              value: doctorData?.specialty_name || 'Sin asignar',
              color: 'text-purple-600'
            }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MENU_ITEMS.map(({ icon, title, desc, color, iconBg, path }) => (
            <div
              key={title}
              onClick={() => navigate(path)}
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
