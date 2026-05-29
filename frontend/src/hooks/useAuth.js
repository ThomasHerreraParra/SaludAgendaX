// src/hooks/useAuth.js
// Centraliza el estado de autenticación

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')
    if (token && role) {
      setUser({ role, username })
    }
  }, [])

  const logout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  return { user, logout }
}

export const getStoredUser = () => ({
  role: localStorage.getItem('role'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('access_token'),
})
