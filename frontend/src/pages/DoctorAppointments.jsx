import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import {
    getDoctorAppointments,
    updateAppointmentStatus
} from '../api/appointments'

const DoctorAppointments = () => {

    const navigate = useNavigate()

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')

    const [appointments, setAppointments] = useState([])
    const today = new Date()
        .toISOString()
        .split('T')[0]
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

        loadAppointments()

    }, [])

    const loadAppointments = async () => {

        try {

            const res = await getDoctorAppointments()

            const activeAppointments = res.data
                .filter(
                    appointment => appointment.status !== 'cancelled'
                )
                .sort(
                    (a, b) =>
                        `${a.appointment_date} ${a.appointment_time}`
                            .localeCompare(
                                `${b.appointment_date} ${b.appointment_time}`
                            )
                )

            setAppointments(activeAppointments)

        } catch (error) {

            console.log(error)

            showToast(
                'Error al cargar las citas',
                'error'
            )

        } finally {

            setLoading(false)

        }

    }

    const handleUpdateStatus = async (
        appointmentId,
        status
    ) => {

        try {

            await updateAppointmentStatus(
                appointmentId,
                status
            )

            showToast(
                'Estado actualizado correctamente'
            )

            loadAppointments()

        } catch (error) {

            console.log(error)

            showToast(
                'Error al actualizar estado',
                'error'
            )

        }

    }

    const getStatusColor = (status) => {

        switch (status) {

            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200'

            case 'approved':
                return 'bg-teal-50 text-teal-700 border border-teal-200'

            case 'completed':
                return 'bg-slate-100 text-slate-700 border border-slate-200'

            case 'cancelled':
                return 'bg-red-50 text-red-600 border border-red-200'

            default:
                return 'bg-slate-50 text-slate-700 border border-slate-200'
        }
    }

    const todayAppointments = appointments.filter(
        appointment => appointment.appointment_date === today
    )

    const futureAppointments = appointments.filter(
        appointment => appointment.appointment_date !== today
    )

    const renderAppointmentCard = (appointment) => (

        <div
            key={appointment.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
        >

            <div className="flex justify-between items-start mb-4">

                <div>

                    <h2 className="text-lg font-semibold text-slate-800">
                        {appointment.patient_name}
                    </h2>

                    <p className="text-sm text-slate-500">
                        Paciente
                    </p>

                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}
                >
                    {appointment.status}
                </span>

            </div>

            <div className="space-y-3">

                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">
                        Especialidad
                    </p>

                    <p className="font-semibold text-slate-700">
                        {appointment.specialty_name}
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">
                        Fecha
                    </p>

                    <p className="font-semibold text-slate-700">
                        {appointment.appointment_date}
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">
                        Hora
                    </p>

                    <p className="font-semibold text-slate-700">
                        {appointment.appointment_time}
                    </p>
                </div>

            </div>

            {
                appointment.status === 'pending'
                && appointment.appointment_date === today
                && (

                    <div className="flex gap-2 mt-4">

                        <button
                            onClick={() =>
                                handleUpdateStatus(
                                    appointment.id,
                                    'completed'
                                )
                            }
                            className="flex-1 bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition cursor-pointer"
                        >
                            Completada
                        </button>

                        <button
                            onClick={() =>
                                handleUpdateStatus(
                                    appointment.id,
                                    'no_show'
                                )
                            }
                            className="flex-1 bg-white border border-red-300 text-red-600 py-2 rounded-xl hover:bg-red-50 transition cursor-pointer"
                        >
                            No asistió
                        </button>

                    </div>

                )
            }

        </div>

    )

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar
                role={role}
                username={username}
            />

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

            <button
                onClick={() => navigate('/dashboard/doctor')}
                className="mt-6 ml-6 text-teal-600 hover:text-teal-800 cursor-pointer"
            >
                ← Volver al dashboard
            </button>

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Mis citas
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Consulta todas las citas asignadas a tu agenda.
                    </p>

                </div>

                {
                    loading ? (

                        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                            Cargando citas...
                        </div>

                    ) : appointments.length === 0 ? (

                        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">

                            <h2 className="text-lg font-semibold text-slate-700">
                                No tienes citas asignadas
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Cuando los pacientes soliciten citas aparecerán aquí.
                            </p>

                        </div>

                    ) : (

                        <div>

                            {
                                todayAppointments.length > 0 && (

                                    <div className="mb-10">

                                        <h2 className="text-xl font-bold text-teal-700 mb-4">
                                            Agenda de hoy
                                        </h2>

                                        <p className="text-slate-500 mb-5">
                                            Pacientes programados para atender hoy.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            {
                                                todayAppointments.map(
                                                    renderAppointmentCard
                                                )
                                            }

                                        </div>

                                    </div>

                                )
                            }

                            <div>

                                <h2 className="text-xl font-bold text-teal-700 mb-4">
                                    Agenda del mes
                                </h2>

                                <p className="text-slate-500 mb-5">
                                    Pacientes programados para atender en el resto del mes.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {
                                        futureAppointments.map(
                                            renderAppointmentCard
                                        )
                                    }

                                </div>

                            </div>

                        </div>



                    )
                }

            </main>

        </div>

    )

}

export default DoctorAppointments