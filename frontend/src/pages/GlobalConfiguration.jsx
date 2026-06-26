import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import {
    getGlobalConfiguration,
    updateGlobalConfiguration
} from '../api/users'

const GlobalConfiguration = () => {

    const navigate = useNavigate()

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')

    const [config, setConfig] = useState(null)

    const [form, setForm] = useState({
        workday_start: '',
        workday_end: '',
        max_days_in_advance: '',
        notifications_enabled: true,
        holidays_enabled: true,
    })

    const [toast, setToast] = useState(null)

    const showToast = (msg, type = "success") => {

        setToast({ msg, type })

        setTimeout(() => {

            setToast(null)

        }, 3000)

    }

    const handleSave = async () => {

        try {

            const { data } =
                await updateGlobalConfiguration(form)

            setConfig(data)

            showToast(
                "Configuración actualizada correctamente."
            )

        } catch (error) {

            console.log(error)

            showToast(
                "Error al guardar la configuración.",
                "error"
            )

        }

    }

    const loadConfiguration = async () => {

        try {

            const { data } =
                await getGlobalConfiguration()

            setConfig(data)
            setForm(data)

        } catch (error) {

            console.log(error)

        }

    }

    useEffect(() => {

        if (role !== 'superadmin') {

            navigate(`/dashboard/${role}`)

            return

        }

        loadConfiguration()

    }, [])

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar
                role={role}
                username={username}
            />

            {
                toast && (

                    <div
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium

            ${toast.type === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-teal-600 text-white'
                            }`}
                    >

                        {toast.msg}

                    </div>

                )
            }

            <main className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate('/dashboard/superadmin')}
                    className="text-teal-600 mb-6 hover:text-teal-800"
                >
                    ← Volver
                </button>

                <h1 className="text-3xl font-bold text-slate-800">

                    Configuración Global

                </h1>

                <p className="text-slate-500 mt-2">

                    Administra los parámetros generales del sistema.

                </p>

                <div className="mt-10 grid lg:grid-cols-2 gap-6">

                    {/* Horarios */}

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <h2 className="text-xl font-semibold mb-5">

                            🕒 Horarios laborales

                        </h2>

                        <div className="space-y-5">

                            <div>

                                <label className="block mb-2 text-sm text-slate-600">

                                    Hora de inicio

                                </label>

                                <input

                                    type="time"

                                    value={form.workday_start}

                                    onChange={(e) =>

                                        setForm({

                                            ...form,

                                            workday_start: e.target.value

                                        })

                                    }

                                    className="w-full rounded-xl border border-slate-300 px-4 py-3"

                                />

                            </div>

                            <div>

                                <label className="block mb-2 text-sm text-slate-600">

                                    Hora de finalización

                                </label>

                                <input

                                    type="time"

                                    value={form.workday_end}

                                    onChange={(e) =>

                                        setForm({

                                            ...form,

                                            workday_end: e.target.value

                                        })

                                    }

                                    className="w-full rounded-xl border border-slate-300 px-4 py-3"

                                />

                            </div>

                        </div>

                    </div>



                    {/* Agenda */}

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <h2 className="text-xl font-semibold mb-5">

                            📅 Agenda

                        </h2>

                        <label className="block mb-2 text-sm text-slate-600">

                            Máximo de días para reservar

                        </label>

                        <input

                            type="number"

                            value={form.max_days_in_advance}

                            onChange={(e) =>

                                setForm({

                                    ...form,

                                    max_days_in_advance: e.target.value

                                })

                            }

                            className="w-full rounded-xl border border-slate-300 px-4 py-3"

                        />

                    </div>



                    {/* Notificaciones */}

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <h2 className="text-xl font-semibold mb-5">

                            🔔 Notificaciones

                        </h2>

                        <label className="flex items-center justify-between">

                            <span>

                                Activar notificaciones automáticas

                            </span>

                            <input

                                type="checkbox"

                                checked={form.notifications_enabled}

                                onChange={(e) =>

                                    setForm({

                                        ...form,

                                        notifications_enabled: e.target.checked

                                    })

                                }

                                className="w-5 h-5"

                            />

                        </label>

                    </div>



                    {/* Feriados */}

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">

                        <h2 className="text-xl font-semibold mb-5">

                            🎉 Feriados

                        </h2>

                        <label className="flex items-center justify-between">

                            <span>

                                Bloquear citas durante feriados

                            </span>

                            <input

                                type="checkbox"

                                checked={form.holidays_enabled}

                                onChange={(e) =>

                                    setForm({

                                        ...form,

                                        holidays_enabled: e.target.checked

                                    })

                                }

                                className="w-5 h-5"

                            />

                        </label>

                    </div>

                </div>
                <div className="mt-8 flex justify-end">

                    <button

                        onClick={handleSave}

                        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow cursor-pointer"

                    >

                        Guardar cambios

                    </button>

                </div>
            </main>

        </div>

    )

}

export default GlobalConfiguration