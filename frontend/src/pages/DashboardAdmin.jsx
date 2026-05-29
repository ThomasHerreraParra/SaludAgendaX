// src/pages/DashboardAdmin.jsx
// HU-19 / HU-10 / HU-11 / HU-12: Panel administrativo completo

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getUsers, deactivatePatient, reactivatePatient, deactivateDoctor, assignSpecialty } from '../api/auth'
import { getSpecialties, createSpecialty } from '../api/specialties'

const TABS = ['Resumen', 'Pacientes', 'Médicos', 'Especialidades']

const DashboardAdmin = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  const [tab, setTab] = useState('Resumen')
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Modal asignar especialidad
  const [assignModal, setAssignModal] = useState(null) // { doctorId, doctorName }
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  // Modal nueva especialidad
  const [newSpecForm, setNewSpecForm] = useState({ name: '', description: '' })
  const [showNewSpec, setShowNewSpec] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) navigate('/login')
    if (role && !['admin', 'superadmin'].includes(role)) navigate(`/dashboard/${role}`)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pRes, dRes, sRes] = await Promise.all([
        getUsers({ role: 'patient' }),
        getUsers({ role: 'doctor' }),
        getSpecialties(),
      ])
      setPatients(pRes.data)
      setDoctors(dRes.data)
      setSpecialties(sRes.data)
    } catch {
      showToast('Error al cargar datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDeactivatePatient = async (id, name) => {
    if (!confirm(`¿Desactivar al paciente ${name}?`)) return
    try {
      await deactivatePatient(id)
      setPatients((p) => p.map((u) => (u.id === id ? { ...u, is_active: false } : u)))
      showToast(`Paciente ${name} desactivado.`)
    } catch {
      showToast('Error al desactivar paciente', 'error')
    }
  }

  const handleReactivatePatient = async (id, name) => {
    try {
      await reactivatePatient(id)
      setPatients((p) => p.map((u) => (u.id === id ? { ...u, is_active: true } : u)))
      showToast(`Paciente ${name} reactivado.`)
    } catch {
      showToast('Error al reactivar paciente', 'error')
    }
  }

  const handleDeactivateDoctor = async (id, name) => {
    if (!confirm(`¿Desactivar al médico ${name}?`)) return
    try {
      await deactivateDoctor(id)
      setDoctors((d) => d.map((u) => (u.id === id ? { ...u, is_active: false } : u)))
      showToast(`Médico ${name} desactivado.`)
    } catch {
      showToast('Error al desactivar médico', 'error')
    }
  }

  const handleAssignSpecialty = async () => {
    if (!selectedSpecialty) return
    try {
      await assignSpecialty(assignModal.doctorId, selectedSpecialty)
      const spec = specialties.find((s) => s.id === parseInt(selectedSpecialty))
      setDoctors((d) =>
        d.map((u) =>
          u.id === assignModal.doctorId
            ? { ...u, specialty: spec?.id, specialty_name: spec?.name }
            : u
        )
      )
      showToast(`Especialidad asignada a ${assignModal.doctorName}.`)
      setAssignModal(null)
      setSelectedSpecialty('')
    } catch {
      showToast('Error al asignar especialidad', 'error')
    }
  }

  const handleCreateSpecialty = async (e) => {
    e.preventDefault()
    try {
      const { data } = await createSpecialty(newSpecForm)
      setSpecialties((s) => [...s, data])
      showToast(`Especialidad "${data.name}" creada.`)
      setNewSpecForm({ name: '', description: '' })
      setShowNewSpec(false)
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || 'Error al crear especialidad'
      showToast(msg, 'error')
    }
  }

  const activePat = patients.filter((p) => p.is_active).length
  const activeDoc = doctors.filter((d) => d.is_active).length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} username={username} />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-teal-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Modal asignar especialidad */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Asignar especialidad</h3>
            <p className="text-slate-500 text-sm mb-4">Médico: <strong>{assignModal.doctorName}</strong></p>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Selecciona una especialidad</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleAssignSpecialty}
                className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                Asignar
              </button>
              <button
                onClick={() => { setAssignModal(null); setSelectedSpecialty('') }}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Panel Administrativo</h1>
          <p className="text-slate-500 mt-1">Gestión de pacientes, médicos y especialidades</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
        )}

        {/* RESUMEN */}
        {!loading && tab === 'Resumen' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Pacientes activos', value: activePat, color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Pacientes inactivos', value: patients.length - activePat, color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'Médicos activos', value: activeDoc, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Especialidades', value: specialties.length, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl border border-slate-100 p-6`}>
                <p className="text-xs text-slate-400 mb-2">{label}</p>
                <p className={`text-4xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* PACIENTES */}
        {!loading && tab === 'Pacientes' && (
          <div>
            <h2 className="text-base font-semibold text-slate-700 mb-4">
              Pacientes registrados ({patients.length})
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Documento</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">EPS</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-800">{p.full_name || p.username}</td>
                        <td className="px-5 py-3 text-slate-500">{p.document}</td>
                        <td className="px-5 py-3 text-slate-500">{p.eps || '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.is_active ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {p.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {p.is_active ? (
                            <button
                              onClick={() => handleDeactivatePatient(p.id, p.full_name || p.username)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivatePatient(p.id, p.full_name || p.username)}
                              className="text-xs text-teal-600 hover:text-teal-800 font-medium px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                            >
                              Reactivar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {patients.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">Sin pacientes registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MÉDICOS */}
        {!loading && tab === 'Médicos' && (
          <div>
            <h2 className="text-base font-semibold text-slate-700 mb-4">
              Médicos registrados ({doctors.length})
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Documento</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Especialidad</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-800">{d.full_name || d.username}</td>
                        <td className="px-5 py-3 text-slate-500">{d.document}</td>
                        <td className="px-5 py-3">
                          {d.specialty_name ? (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium">{d.specialty_name}</span>
                          ) : (
                            <span className="text-slate-400 text-xs">Sin asignar</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            d.is_active ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {d.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-5 py-3 flex gap-2">
                          <button
                            onClick={() => setAssignModal({ doctorId: d.id, doctorName: d.full_name || d.username })}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Asignar esp.
                          </button>
                          {d.is_active && (
                            <button
                              onClick={() => handleDeactivateDoctor(d.id, d.full_name || d.username)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Desactivar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {doctors.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">Sin médicos registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ESPECIALIDADES */}
        {!loading && tab === 'Especialidades' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-700">
                Especialidades ({specialties.length})
              </h2>
              <button
                onClick={() => setShowNewSpec(!showNewSpec)}
                className="bg-teal-600 text-white text-sm px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                + Nueva especialidad
              </button>
            </div>

            {showNewSpec && (
              <form onSubmit={handleCreateSpecialty} className="bg-white rounded-2xl border border-teal-100 p-5 mb-4 flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-48">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre *</label>
                  <input
                    value={newSpecForm.name}
                    onChange={(e) => setNewSpecForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: Cardiología"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex-1 min-w-48">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                  <input
                    value={newSpecForm.description}
                    onChange={(e) => setNewSpecForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Descripción breve (opcional)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  Crear
                </button>
                <button type="button" onClick={() => setShowNewSpec(false)} className="text-slate-500 text-sm px-3 py-2">
                  Cancelar
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialties.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{s.name}</h3>
                      {s.description && <p className="text-sm text-slate-500 mt-1">{s.description}</p>}
                    </div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {s.doctor_count} médico{s.doctor_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
              {specialties.length === 0 && (
                <div className="col-span-3 text-center py-10 text-slate-400">
                  No hay especialidades registradas. Crea la primera.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardAdmin
