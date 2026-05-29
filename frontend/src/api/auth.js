// src/api/auth.js
import api from './client'

export const login = (username, password) =>
  api.post('/login/', { username, password })

export const register = (data) =>
  api.post('/register/', data)

export const getMe = () =>
  api.get('/me/')

export const getUsers = (params = {}) =>
  api.get('/users/', { params })

export const deactivatePatient = (id) =>
  api.patch(`/users/patients/${id}/deactivate/`)

export const reactivatePatient = (id) =>
  api.patch(`/users/patients/${id}/reactivate/`)

export const deactivateDoctor = (id) =>
  api.patch(`/users/doctors/${id}/deactivate/`)

export const assignSpecialty = (doctorId, specialtyId) =>
  api.patch(`/users/doctors/${doctorId}/assign-specialty/`, { specialty_id: specialtyId })
