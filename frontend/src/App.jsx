// App.jsx
// Componente raíz de SaludAgendaX
// Define todas las rutas de navegación de la aplicación
// Cada ruta corresponde a una página diferente según el rol del usuario

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardPatient from './pages/DashboardPatient'
import DashboardDoctor from './pages/DashboardDoctor'
import Register from './pages/Register'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/patient" element={<DashboardPatient />} />
        <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
        <Route path="/dashboard/admin" element={<DashboardPatient />} />
        <Route path="/dashboard/superadmin" element={<DashboardPatient />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


