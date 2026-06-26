// src/pages/DashboardSuperAdmin.jsx
// HU-19: Panel del Superadministrador — acceso total al sistema

import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import {
  getEPSConfigurations,
  updateEPSConfiguration,
} from '../api/eps'
import {
  getGlobalConfiguration,
  updateGlobalConfiguration
} from '../api/users'


const DashboardSuperAdmin = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  const [epsConfigs, setEpsConfigs] = useState([])
  const [globalConfig, setGlobalConfig] = useState(null)

  const [editingGlobal, setEditingGlobal] = useState(false)

  const [globalForm, setGlobalForm] = useState({
    workday_start: '',
    workday_end: '',
    max_days_in_advance: '',
    notifications_enabled: true,
    holidays_enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    appointment_limit: '',
    budget_limit: '',
  })


  const loadEPS = async () => {

    try {

      const { data } = await getEPSConfigurations()

      console.log(data)

      setEpsConfigs(data)

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  const loadGlobalConfiguration = async () => {

    try {

      const { data } =
        await getGlobalConfiguration()

      setGlobalConfig(data)

    } catch (error) {

      console.log(error)

    }

  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const handleSave = async () => {

    if (
      Number(form.appointment_limit) < 0 ||
      Number(form.budget_limit) < 0
    ) {

      showToast(
        'Los valores no pueden ser negativos.',
        'error'
      )

      return
    }

    try {

      const { data } =
        await updateEPSConfiguration(
          editing.id,
          form
        )

      setEpsConfigs(configs =>
        configs.map(c =>
          c.id === data.id
            ? data
            : c
        )
      )

      showToast(
        'Configuración actualizada correctamente.'
      )

      setEditing(null)

    } catch {

      showToast(
        'Error al guardar la configuración.',
        'error'
      )

    }

  }

  useEffect(() => {

    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    if (role && role !== 'superadmin') {
      navigate(`/dashboard/${role}`)
      return
    }

    loadEPS()
    loadGlobalConfiguration()

  }, [])

  const handleSaveEPS = async () => {

    try {

      const { data } = await updateEPSConfiguration(
        editing.id,
        {
          appointment_limit: Number(form.appointment_limit),
          budget_limit: Number(form.budget_limit),
        }
      )

      setEpsConfigs(
        epsConfigs.map((eps) =>
          eps.id === data.id
            ? data
            : eps
        )
      )

      setEditing(null)

    } catch (err) {

      console.log(err)

      alert("Error al actualizar la configuración.")

    }

  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} username={username} />

      {/* Modal editar EPS */}
      {
        editing && (

          <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">

            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Configurar EPS
              </h3>

              <p className="text-slate-500 text-sm mb-4">
                {editing.eps_name}
              </p>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm text-slate-600 mb-1">
                    Tope de citas
                  </label>

                  <input
                    type="number"
                    value={form.appointment_limit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        appointment_limit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-600 mb-1">
                    Presupuesto máximo (COP)
                  </label>

                  <input
                    type="number"
                    value={form.budget_limit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        budget_limit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />

                </div>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={handleSaveEPS}
                  className="flex-1 bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700"
                >
                  Guardar
                </button>

                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl"
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>

        )
      }

      {
        toast && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-teal-600 text-white'
              }`}
          >
            {toast.msg}
          </div>
        )
      }



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

        <div className="grid md:grid-cols-2 gap-5 mb-10">

          <div
            onClick={() => navigate('/dashboard/admin')}
            className="cursor-pointer rounded-2xl border border-teal-100 bg-teal-50 p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">
              🏥
            </div>

            <h3 className="font-semibold text-slate-800">
              Gestión administrativa
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Administra pacientes, médicos y especialidades.
            </p>

          </div>

          <div
            onClick={() => navigate('/global-configuration')}
            className="cursor-pointer rounded-2xl border border-orange-100 bg-orange-50 p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">
              ⚙️
            </div>

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-slate-800">
                Configuración global
              </h3>

            </div>

            <p className="text-sm text-slate-500 mt-1">
              Horarios, sedes, parámetros y configuración del sistema.
            </p>

          </div>

        </div>

        {/* Configuración EPS */}
        <div className="mt-12 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
              💰
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Parámetros de EPS
              </h2>

              <p className="text-slate-500">
                Administra los topes de citas y el presupuesto asignado para cada EPS.
              </p>
            </div>
          </div>
        </div>
        {/* HU-13 y HU-14 */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">
              Configuración de EPS
            </h2>

            <p className="text-sm text-slate-500">
              Define el número máximo de citas y el presupuesto disponible para cada EPS.
            </p>
          </div>

          <table className="w-full text-sm">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-3">
                  EPS
                </th>

                <th className="text-center">
                  Tope de citas
                </th>

                <th className="text-center">
                  Presupuesto máximo
                </th>

                <th className="text-center">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {epsConfigs.map((eps) => (

                <tr
                  key={eps.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-medium">
                    {eps.eps_name}
                  </td>

                  <td className="text-center">
                    {eps.appointment_limit}
                  </td>

                  <td className="text-center">
                    $
                    {Number(eps.budget_limit).toLocaleString('es-CO')}
                  </td>

                  <td className="text-center">

                    <button
                      onClick={() => {

                        setEditing(eps)

                        setForm({
                          appointment_limit: eps.appointment_limit,
                          budget_limit: eps.budget_limit,
                        })

                      }}
                      className="text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Editar
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </main>
    </div>
  )
}

export default DashboardSuperAdmin
