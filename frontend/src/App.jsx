// App.jsx
// Componente raíz de SaludAgendaX
// Define todas las rutas de navegación con protección básica por rol

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardPatient from './pages/DashboardPatient'
import DashboardDoctor from './pages/DashboardDoctor'
import DashboardAdmin from './pages/DashboardAdmin'
import Landing from './pages/Landing'
import DashboardSuperAdmin from './pages/DashboardSuperAdmin'
import RequestAppointment from './pages/RequestAppointment'
import MyAppointments from './pages/MyAppointments'
import EditAppointment from './pages/EditAppointment'
import AppointmentHistory from './pages/AppointmentHistory'
import MyProfile from './pages/MyProfile'
import DoctorAppointments from './pages/DoctorAppointments'
import DoctorSchedule from './pages/DoctorSchedule'
import GlobalConfiguration from './pages/GlobalConfiguration'

// Redirige al dashboard correspondiente si ya hay sesión
const RootRedirect = () => {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('access_token')
  if (token && role) return <Navigate to={`/dashboard/${role}`} replace />
  return <Navigate to="/login" replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/patient" element={<DashboardPatient />} />
        <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/superadmin" element={<DashboardSuperAdmin />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/appointments/request" element={<RequestAppointment />} />
        <Route path="/appointments/my" element={<MyAppointments />} />
        <Route path="/appointments/edit" element={<EditAppointment />} />
        <Route path="/appointments/history" element={<AppointmentHistory />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/global-configuration" element={<GlobalConfiguration />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
