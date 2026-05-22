// App.jsx
// Componente raíz de SaludAgendaX
// Define todas las rutas de navegación de la aplicación
// Cada ruta corresponde a una página diferente según el rol del usuario

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/patient" element={<Dashboard />} />
        <Route path="/dashboard/doctor" element={<Dashboard />} />
        <Route path="/dashboard/admin" element={<Dashboard />} />
        <Route path="/dashboard/superadmin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


