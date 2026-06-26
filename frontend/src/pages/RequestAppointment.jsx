import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import {
    createAppointment,
    getDoctorsBySpecialty,
    getSpecialties,
    getAvailability
} from '../api/appointments'


const RequestAppointment = () => {

    const navigate = useNavigate()

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')


    const today = new Date()

    const minDate = today.toISOString().split('T')[0]


    today.setDate(today.getDate() + 30)

    const maxDate = today.toISOString().split('T')[0]


    const [specialties, setSpecialties] = useState([])
    const [doctors, setDoctors] = useState([])
    const [availability, setAvailability] = useState([])

    const [form, setForm] = useState({
        doctor: '',
        specialty: '',
        appointment_date: '',
        appointment_time: ''
    })


    const [toast, setToast] = useState(null)

    const [calendarView, setCalendarView] = useState('day')

    const showToast = (msg, type = 'success') => {

        setToast({ msg, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)

    }


    useEffect(() => {

        if (role !== 'patient') {
            navigate(`/dashboard/${role}`)
            return
        }

        loadSpecialties()

    }, [])



    const loadSpecialties = async () => {

        try {

            const res = await getSpecialties()
            setSpecialties(res.data)

        } catch (error) {

            console.log(error)

        }

    }


    const handleSpecialtyChange = async (e) => {

        const id = e.target.value

        setForm({
            ...form,
            specialty: id,
            doctor: ''
        })




        try {

            const res = await getDoctorsBySpecialty(id)

            console.log("Médicos encontrados:", res.data)

            setDoctors(res.data)

        } catch (error) {

            console.log(error)

        }

    }

    const handleDoctorChange = async (e) => {

        const doctorId = e.target.value


        setForm({
            ...form,
            doctor: doctorId,
            appointment_time: ''
        })


        if (form.appointment_date) {

            const res = await getAvailability(
                doctorId,
                form.appointment_date
            )

            setAvailability(res.data)

        }

    }



    const handleSubmit = async (e) => {

        e.preventDefault()

        if (
            !form.doctor ||
            !form.specialty ||
            !form.appointment_date ||
            !form.appointment_time
        ) {
            showToast(
                "Todos los campos son obligatorios",
                "error"
            )
            return
        }

        try {

            await createAppointment(form)

            showToast(
                "Cita solicitada correctamente"
            )


            setForm({
                doctor: '',
                specialty: '',
                appointment_date: '',
                appointment_time: ''
            })


        } catch (error) {

            console.log(error.response?.data)

            const backendError =
                error.response?.data?.non_field_errors?.[0]

            showToast(
                backendError || "Error al solicitar la cita.",
                "error"
            )

        }

    }


    const formatDate = (date) =>
        date.toISOString().split('T')[0]

    const getAvailableDates = () => {

        const dates = []

        const base = new Date()

        let totalDays = 7

        if (calendarView === 'week')
            totalDays = 28

        if (calendarView === 'month')
            totalDays = 30

        for (let i = 0; i < totalDays; i++) {

            const d = new Date(base)

            d.setDate(base.getDate() + i)

            dates.push({
                value: formatDate(d),
                day: d.toLocaleDateString('es-CO', {
                    weekday: 'short'
                }),
                number: d.getDate(),
                month: d.toLocaleDateString('es-CO', {
                    month: 'short'
                })
            })

        }

        return dates

    }


    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar role={role} username={username} />
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
            <div><br></br></div>
            <button
                onClick={() => navigate('/dashboard/patient')}
                className="mb-6 text-teal-600 hover:text-teal-800 font-medium flex items-center gap-2 cursor-pointer"
            >
                ‎ ‎ ‎ ‎ ← Volver al dashboard
            </button>

            <main className="max-w-xl mx-auto px-6 py-10">


                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    Solicitar cita médica
                </h1>

                <p className="text-slate-500 mt-2 mb-8">
                    Selecciona una especialidad, el médico de tu preferencia y un horario disponible.
                </p>

                {/* Vista del calendario */}
                <div className="flex items-center gap-3 mb-8">

                    <span className="text-sm font-medium text-slate-600">
                        Vista:
                    </span>

                    {[
                        { id: 'day', label: 'Diaria' },
                        { id: 'week', label: 'Semanal' },
                        { id: 'month', label: 'Mensual' }
                    ].map(view => (

                        <button
                            key={view.id}
                            type="button"
                            onClick={() => setCalendarView(view.id)}
                            className={`
                px-4 py-2 rounded-xl text-sm transition
                ${calendarView === view.id
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white border border-slate-300 hover:bg-slate-100'
                                }
            `}
                        >
                            {view.label}
                        </button>

                    ))}

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6"
                >


                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Especialidad
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                            {
                                specialties.map((specialty) => (

                                    <button
                                        key={specialty.id}
                                        type="button"
                                        onClick={() =>
                                            handleSpecialtyChange({
                                                target: {
                                                    value: specialty.id
                                                }
                                            })
                                        }

                                        className={`
                        rounded-2xl border p-4 text-left transition

                        ${String(form.specialty) === String(specialty.id)

                                                ? 'bg-teal-600 text-white border-teal-600 shadow'

                                                : 'bg-white border-slate-200 hover:border-teal-500 hover:bg-teal-50'
                                            }
                    `}
                                    >

                                        <p className="font-semibold">

                                            {specialty.name}

                                        </p>

                                    </button>

                                ))
                            }

                        </div>

                    </div>



                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Médico
                        </label>

                        <div className="grid grid-cols-1 gap-3">

                            {

                                doctors.length === 0

                                    ?

                                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-400">

                                        Primero selecciona una especialidad.

                                    </div>

                                    :

                                    doctors.map((doctor) => (

                                        <button

                                            key={doctor.id}

                                            type="button"

                                            onClick={() =>
                                                handleDoctorChange({
                                                    target: {
                                                        value: doctor.id
                                                    }
                                                })
                                            }

                                            className={`
                        rounded-2xl border p-4 flex justify-between items-center transition

                        ${String(form.doctor) === String(doctor.id)

                                                    ? 'bg-teal-600 text-white border-teal-600 shadow'

                                                    : 'bg-white border-slate-200 hover:border-teal-500 hover:bg-teal-50'
                                                }
                    `}
                                        >

                                            <div>

                                                <p className="font-semibold">

                                                    👨‍⚕️ {doctor.full_name || doctor.username}

                                                </p>

                                            </div>

                                        </button>

                                    ))

                            }

                        </div>

                    </div>




                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">

                            {calendarView === 'day' && 'Selecciona un día'}

                            {calendarView === 'week' && 'Selecciona un día de la semana'}

                            {calendarView === 'month' && 'Selecciona un día del mes'}

                        </label>


                        <div className="grid grid-cols-7 gap-3">

                            {getAvailableDates().map(date => (

                                <button
                                    key={date.value}
                                    type="button"
                                    onClick={async () => {

                                        setForm({
                                            ...form,
                                            appointment_date: date.value,
                                            appointment_time: ''
                                        })

                                        if (form.doctor) {

                                            const res = await getAvailability(
                                                form.doctor,
                                                date.value
                                            )

                                            setAvailability(res.data)

                                        }

                                    }}
                                    className={`
                rounded-2xl border p-3 transition

                ${form.appointment_date === date.value
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'bg-white hover:bg-teal-50 border-slate-200'
                                        }
            `}
                                >

                                    <p className="text-xs uppercase">
                                        {date.day}
                                    </p>

                                    <p className="text-xl font-bold">
                                        {date.number}
                                    </p>

                                    <p className="text-xs">
                                        {date.month}
                                    </p>

                                </button>

                            ))}

                        </div>
                        <p className="text-xs text-slate-500 mt-2">

                            {calendarView === 'day' &&
                                'Visualizando disponibilidad para un único día.'}

                            {calendarView === 'week' &&
                                'Vista semanal: selecciona cualquier día de la semana para consultar horarios.'}

                            {calendarView === 'month' &&
                                'Vista mensual: consulta la disponibilidad de cualquier fecha del mes.'}

                        </p>

                    </div>



                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hora
                        </label>


                        <div className="grid grid-cols-3 gap-3">

                            {
                                availability.length === 0 ? (

                                    <div className="col-span-3 text-center py-6 text-slate-400">

                                        No hay horarios disponibles.

                                    </div>

                                ) : (

                                    availability.map(slot => (

                                        <button
                                            key={slot.id}
                                            type="button"
                                            onClick={() =>
                                                setForm({
                                                    ...form,
                                                    appointment_time: slot.time
                                                })
                                            }

                                            className={`rounded-xl border py-3 transition font-medium

                    ${form.appointment_time === slot.time
                                                    ? 'bg-teal-600 text-white border-teal-600'
                                                    : 'bg-white border-slate-300 hover:border-teal-500 hover:bg-teal-50'
                                                }`}
                                        >

                                            {slot.time}

                                        </button>

                                    ))

                                )
                            }

                        </div>

                        {
                            availability.length > 0 && (

                                <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 flex justify-between">

                                    <span className="text-sm text-teal-700">

                                        Horarios disponibles

                                    </span>

                                    <span className="font-semibold text-teal-700">

                                        {availability.length}

                                    </span>

                                </div>

                            )
                        }


                    </div>

                    <button

                        className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition shadow-sm cursor-pointer">
                        Solicitar cita
                    </button>
                </form>






            </main>


        </div>

    )


}


export default RequestAppointment