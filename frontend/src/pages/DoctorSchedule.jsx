import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import { getMyAvailability } from '../api/appointments'

const DoctorSchedule = () => {

    const navigate = useNavigate()

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')

    const [schedule, setSchedule] = useState([])
    const [loading, setLoading] = useState(true)

    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {

        setToast({ msg, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)

    }

    useEffect(() => {

        if (role !== 'doctor') {
            navigate(`/dashboard/${role}`)
            return
        }

        loadSchedule()

    }, [])

    const loadSchedule = async () => {

        try {

            const res = await getMyAvailability()

            setSchedule(res.data)

        } catch (error) {

            console.log(error)

            showToast(
                'Error al cargar la agenda',
                'error'
            )

        } finally {

            setLoading(false)

        }

    }

    const totalSlots = schedule.length

    const availableSlots = schedule.filter(
        slot => slot.is_available
    ).length

    const occupiedSlots = schedule.filter(
        slot => !slot.is_available
    ).length

    const groupedSchedule = schedule.reduce((acc, slot) => {

        if (!acc[slot.date]) {
            acc[slot.date] = []
        }

        acc[slot.date].push(slot)

        return acc

    }, {})

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar
                role={role}
                username={username}
            />

            {
                toast && (

                    <div
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
                            toast.type === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-teal-600 text-white'
                        }`}
                    >
                        {toast.msg}
                    </div>

                )
            }

            <button
                onClick={() => navigate('/dashboard/doctor')}
                className="mt-6 ml-6 text-teal-600 hover:text-teal-800 cursor-pointer"
            >
                ← Volver al dashboard
            </button>

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Mi agenda
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Consulta tus horarios disponibles y ocupados.
                    </p>

                </div>

                {/* Resumen */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-xs text-slate-400">
                            Horarios registrados
                        </p>

                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {totalSlots}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-xs text-slate-400">
                            Disponibles
                        </p>

                        <p className="text-3xl font-bold text-teal-600 mt-2">
                            {availableSlots}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-xs text-slate-400">
                            Ocupados
                        </p>

                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {occupiedSlots}
                        </p>
                    </div>

                </div>

                {
                    loading ? (

                        <div className="bg-white rounded-3xl p-8 text-center">
                            Cargando agenda...
                        </div>

                    ) : Object.keys(groupedSchedule).length === 0 ? (

                        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">

                            <h2 className="text-lg font-semibold text-slate-700">
                                No tienes horarios registrados
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Crea disponibilidades para comenzar a recibir citas.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-8">

                            {
                                Object.entries(groupedSchedule).map(
                                    ([date, slots]) => (

                                        <div key={date}>

                                            <h2 className="text-xl font-bold text-slate-800 mb-4">
                                                📅 {date}
                                            </h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                                {
                                                    slots.map(slot => (

                                                        <div
                                                            key={slot.id}
                                                            className={`rounded-2xl border p-5 shadow-sm ${
                                                                slot.is_available
                                                                    ? 'bg-teal-50 border-teal-200'
                                                                    : 'bg-red-50 border-red-200'
                                                            }`}
                                                        >

                                                            <div className="flex justify-between items-center mb-3">

                                                                <span className="font-bold text-lg">
                                                                    {slot.time}
                                                                </span>

                                                                <span
                                                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                                        slot.is_available
                                                                            ? 'bg-teal-100 text-teal-700'
                                                                            : 'bg-red-100 text-red-700'
                                                                    }`}
                                                                >
                                                                    {
                                                                        slot.is_available
                                                                            ? 'Disponible'
                                                                            : 'Ocupado'
                                                                    }
                                                                </span>

                                                            </div>

                                                            {
                                                                slot.is_available ? (

                                                                    <p className="text-slate-600">
                                                                        Este horario está libre.
                                                                    </p>

                                                                ) : (

                                                                    <div>

                                                                        <p className="text-slate-500 text-sm">
                                                                            Paciente
                                                                        </p>

                                                                        <p className="font-semibold text-slate-800">
                                                                            {slot.patient_name}
                                                                        </p>

                                                                    </div>

                                                                )
                                                            }

                                                        </div>

                                                    ))
                                                }

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </main>

        </div>

    )

}

export default DoctorSchedule