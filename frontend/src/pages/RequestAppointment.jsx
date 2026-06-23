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

            showToast(
                "Error al solicitar cita",
                "error"
            )

        }

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


                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6"
                >


                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Especialidad
                        </label>

                        <select
                            value={form.specialty}
                            onChange={handleSpecialtyChange}
                            className=" w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 "
                        >

                            <option value="">
                                Seleccione
                            </option>


                            {
                                specialties.map(s => (

                                    <option
                                        key={s.id}
                                        value={s.id}
                                    >
                                        {s.name}
                                    </option>

                                ))
                            }


                        </select>

                    </div>



                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Médico
                        </label>

                        <select
                            value={form.doctor}
                            disabled={!form.specialty}


                            onChange={handleDoctorChange}

                            className=" w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"

                        >


                            <option value="">
                                Seleccione
                            </option>


                            {
                                doctors.map(d => (

                                    <option
                                        key={d.id}
                                        value={d.id}
                                    >

                                        {d.full_name || d.username}

                                    </option>

                                ))
                            }


                        </select>

                    </div>




                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fecha
                        </label>


                        <input

                            type="date"

                            min={today}

                            value={form.appointment_date}

                            onChange={async (e) => {

                                const selectedDate = e.target.value


                                setForm({
                                    ...form,
                                    appointment_date: selectedDate
                                })


                                if (form.doctor) {

                                    const res = await getAvailability(
                                        form.doctor,
                                        selectedDate
                                    )

                                    setAvailability(res.data)

                                }

                            }}

                            min={new Date().toISOString().split('T')[0]}
                            max={maxDate}

                            className=" w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 "

                        />

                    </div>



                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Hora
                        </label>


                        <select

                            value={form.appointment_time}

                            onChange={
                                e => setForm({
                                    ...form,
                                    appointment_time: e.target.value
                                })
                            }

                            className=" w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 "

                        >

                            <option value="">
                                Seleccione horario
                            </option>


                            {
                                availability.map(slot => (

                                    <option
                                        key={slot.id}
                                        value={slot.time}
                                    >

                                        {slot.time}

                                    </option>

                                ))
                            }


                        </select>

                        {
                            availability.length > 0 && (
                                <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
                                    <p className="text-sm text-teal-700">
                                        Horarios disponibles: {availability.length}
                                    </p>
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