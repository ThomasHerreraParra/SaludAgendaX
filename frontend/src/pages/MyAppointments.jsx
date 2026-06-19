import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import { getMyAppointments } from '../api/appointments'


const MyAppointments = () => {


const navigate = useNavigate()

const role = localStorage.getItem('role')
const username = localStorage.getItem('username')


const [appointments,setAppointments] = useState([])



useEffect(()=>{

    if(role !== 'patient'){
        navigate(`/dashboard/${role}`)
        return
    }


    loadAppointments()


},[])



const loadAppointments = async()=>{

    try{

        const res = await getMyAppointments()

        setAppointments(res.data)

    }catch(error){

        console.log(error)

    }

}



return (

<div className="min-h-screen bg-slate-50">


<Navbar role={role} username={username}/>



<main className="max-w-5xl mx-auto px-6 py-10">


<h1 className="text-2xl font-bold text-slate-800 mb-6">
Mis citas
</h1>



{
appointments.length === 0 ? (

<p className="text-slate-500">
No tienes citas registradas.
</p>

)

:

(

<div className="grid gap-4">


{
appointments.map((appointment)=>(


<div
key={appointment.id}
className="bg-white rounded-2xl shadow p-6 border"
>


<h2 className="text-lg font-semibold text-teal-700">
{appointment.specialty_name}
</h2>


<p className="text-slate-700 mt-2">
👨‍⚕️ Médico:
{appointment.doctor_name}
</p>


<p>
📅 Fecha:
{appointment.appointment_date}
</p>


<p>
⏰ Hora:
{appointment.appointment_time}
</p>


<p>
Estado:
<span className="font-semibold">
{appointment.status}
</span>
</p>


</div>


))
}


</div>

)

}



<button

onClick={()=>navigate('/dashboard/patient')}

className="
mt-8
bg-teal-600
text-white
px-5
py-2
rounded-xl
cursor-pointer
"

>
Volver al dashboard
</button>



</main>


</div>

)


}


export default MyAppointments