import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAvailability } from '../api/appointments'


const EditAppointment = () => {


    const navigate = useNavigate()
    const location = useLocation()


    const appointment = location.state.appointment


    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')


    const [date, setDate] = useState(
        appointment.appointment_date
    )


    const [availability, setAvailability] = useState([])


    const [time, setTime] = useState('')


    const loadAvailability = async(e)=>{

        const selectedDate = e.target.value

        setDate(selectedDate)

        const res = await getAvailability(
            appointment.doctor,
            selectedDate
        )

        setAvailability(res.data)

    }



return (

<div className="min-h-screen bg-slate-50">

<Navbar role={role} username={username}/>


<main className="max-w-xl mx-auto px-6 py-10">


<h1 className="text-2xl font-bold mb-6">
Modificar cita
</h1>


<div className="bg-white p-6 rounded-2xl shadow space-y-5">


<p>
Doctor:
<b>{appointment.doctor_name}</b>
</p>


<p>
Especialidad:
<b>{appointment.specialty_name}</b>
</p>



<div>

<label>
Nueva fecha
</label>


<input

type="date"

value={date}

onChange={loadAvailability}

className="w-full border rounded-lg p-2"

/>


</div>



<div>

<label>
Nuevo horario
</label>


<select

value={time}

onChange={
e=>setTime(e.target.value)
}

className="w-full border rounded-lg p-2"

>

<option value="">
Seleccione
</option>


{
availability.map(item=>(

<option
key={item.id}
value={item.time}
>

{item.time}

</option>

))
}


</select>


</div>


<button

className="
w-full
bg-teal-600
text-white
py-3
rounded-xl
"

>

Guardar cambios

</button>


</div>


</main>


</div>

)


}


export default EditAppointment