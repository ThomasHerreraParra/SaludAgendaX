import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import {
    getMyAppointments,
    getAvailability,
    rescheduleAppointment,
    cancelAppointment
} from '../api/appointments'




const MyAppointments = () => {


    const navigate = useNavigate()

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')


    const [appointments, setAppointments] = useState([])

    const [selectedAppointment, setSelectedAppointment] = useState(null)

    const [newDate, setNewDate] = useState('')

    const [availableTimes, setAvailableTimes] = useState([])

    const [message, setMessage] = useState('')





    useEffect(() => {

        if (role !== 'patient') {
            navigate(`/dashboard/${role}`)
            return
        }


        loadAppointments()


    }, [])



    const loadAppointments = async () => {

        try {

            const res = await getMyAppointments()

            const activeAppointments = res.data.filter(
                appointment => appointment.status !== 'cancelled'
            )

            setAppointments(activeAppointments)

        } catch (error) {

            console.log(error)

        }

    }

    const handleReschedule = (appointment) => {

        setSelectedAppointment(appointment)

        setNewDate('')

        setAvailableTimes([])

        setNewTime('')


        setTimeout(() => {

            document
                .getElementById('reschedule-box')
                ?.scrollIntoView({
                    behavior: 'smooth'
                })

        }, 100)

    }

    const [newTime, setNewTime] = useState('')

    const handleDateChange = async (e) => {

        const date = e.target.value

        setNewDate(date)

        try {

            const res = await getAvailability(
                selectedAppointment.doctor,
                date
            )

            setAvailableTimes(res.data)

        } catch (error) {

            console.log(error)

            setAvailableTimes([])

        }

    }

    const handleSaveReschedule = async () => {

        try {

            await rescheduleAppointment(
                selectedAppointment.id,
                {
                    appointment_date: newDate,
                    appointment_time: newTime
                }
            )


            setMessage(
                "Cita reprogramada correctamente"
            )


            setSelectedAppointment(null)

            loadAppointments()


        } catch (error) {

            console.log(error.response?.data)

            setMessage(
                "Error al reprogramar cita"
            )

        }

    }

    const handleCancelAppointment = async (appointmentId) => {

        const confirmCancel = window.confirm(
            "¿Estás seguro de cancelar esta cita?"
        )


        if (!confirmCancel) {
            return
        }


        try {

            await cancelAppointment(
                appointmentId
            )


            setMessage(
                "Cita cancelada correctamente"
            )


            loadAppointments()


        } catch (error) {

            console.log(error.response?.data)


            setMessage(
                "Error al cancelar la cita"
            )

        }

    }



    return (

        <div className="min-h-screen bg-slate-50">


            <Navbar role={role} username={username} />

            {/*boton de volver atras*/}
            <div><br></br></div>
            <button
                onClick={() => navigate('/dashboard/patient')}
                className="mb-6 text-teal-600 hover:text-teal-800 font-medium flex items-center gap-2 cursor-pointer"
            >
                ‎ ‎ ‎ ‎ ← Volver al dashboard
            </button>

            <main className="max-w-5xl mx-auto px-6 py-10">


                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    Mis citas
                </h1>

                {
                    message && (

                        <p className="mb-4 text-teal-600 font-medium">
                            {message}
                        </p>

                    )
                }


                {
                    selectedAppointment && (

                        <div
                            id="reschedule-box"
                            className="mt-8 bg-white rounded-2xl shadow p-6 border"
                        >

                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Reprogramar cita
                            </h2>


                            <p className="text-slate-600 mb-4">
                                Cita con:
                                <span className="font-semibold">
                                    {" "}{selectedAppointment.doctor_name}
                                </span>
                            </p>


                            <label className="block text-sm text-slate-600 mb-2">
                                Nueva fecha
                            </label>


                            <input
                                type="date"
                                value={newDate}
                                onChange={handleDateChange}
                                className="border rounded-lg p-2"
                            />

                            {
                                availableTimes.length > 0 && (

                                    <div className="mt-4">

                                        <label className="block text-sm text-slate-600 mb-2">
                                            Nueva hora
                                        </label>


                                        <select
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            className="border rounded-lg p-2 w-full"
                                        >

                                            <option value="">
                                                Seleccione una hora
                                            </option>


                                            {
                                                availableTimes.map(time => (

                                                    <option
                                                        key={time.id}
                                                        value={time.time}
                                                    >
                                                        {time.time}
                                                    </option>

                                                ))
                                            }


                                        </select>

                                        <button onClick={handleSaveReschedule} disabled={!newTime} className="mt-4 bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 disabled:bg-slate-300 cursor-pointer">
                                            Guardar cambios
                                        </button>
                                        <button
                                            onClick={() => setSelectedAppointment(null)}
                                            className="mt-4 ml-3 bg-white border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
                                        >
                                            Cancelar
                                        </button>

                                    </div>

                                )
                            }

                        </div>

                    )
                }

                {
                    appointments.length === 0 ? (

                        <p className="text-slate-500">
                            No tienes citas registradas.
                        </p>

                    )

                        :

                        (

                            <div className="grid gap-4 mt-8">


                                {
                                    appointments.map((appointment) => (


                                        <div
                                            key={appointment.id}
                                            className="bg-white rounded-2xl shadow p-6 border"
                                        >


                                            <h2 className="text-lg font-semibold text-teal-700">
                                                {appointment.specialty_name}
                                            </h2>


                                            <p className="text-slate-700 mt-2">
                                                👨‍⚕️ Médico: ‎
                                                {appointment.doctor_name}
                                            </p>


                                            <p>
                                                📅 Fecha: ‎
                                                {appointment.appointment_date}
                                            </p>


                                            <p>
                                                ⏰ Hora: ‎
                                                {appointment.appointment_time}
                                            </p>


                                            <p>
                                                Estado: ‎
                                                <span className="font-semibold">
                                                    {appointment.status}
                                                </span>
                                            </p>

                                            {
                                                appointment.status === 'pending' && (
                                                    <div className="flex gap-3 mt-4">
                                                        <button onClick={() => handleReschedule(appointment)} className=" bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 cursor-pointer">
                                                            Reprogramar
                                                        </button>

                                                        <button onClick={() => handleCancelAppointment(appointment.id)} className="bg-white border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer">
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </div>


                                    ))
                                }



                            </div>

                        )

                }


            </main>
        </div>)
}

export default MyAppointments