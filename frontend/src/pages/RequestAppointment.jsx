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


    const [message, setMessage] = useState('')


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
            setMessage("Todos los campos son obligatorios")
            return
        }

        try {

            await createAppointment(form)

            setMessage(
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

            setMessage(
                "Error al solicitar cita"
            )

        }

    }



    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar role={role} username={username} />
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


                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 space-y-5 shadow"
                >


                    <div>

                        <label>
                            Especialidad
                        </label>

                        <select
                            value={form.specialty}
                            onChange={handleSpecialtyChange}
                            className="w-full border rounded-lg p-2"
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

                        <label>
                            Médico
                        </label>

                        <select
                            value={form.doctor}
                            disabled={!form.specialty}


                            onChange={handleDoctorChange}

                            className="w-full border rounded-lg p-2 disabled:bg-gray-100"

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

                        <label>
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

                            className="w-full border rounded-lg p-2"

                        />

                    </div>



                    <div>

                        <label>
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

                            className="w-full border rounded-lg p-2"

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


                    </div>

                    <button

                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold">
                        Solicitar cita
                    </button>
                </form>



                {
                    message &&
                    <p
                        className={`mt-4 text-center font-medium ${message.includes('correctamente')
                            ? 'text-teal-600'
                            : 'text-red-600'
                            }`}
                    >
                        {message}
                    </p>
                }


            </main>


        </div>

    )


}


export default RequestAppointment