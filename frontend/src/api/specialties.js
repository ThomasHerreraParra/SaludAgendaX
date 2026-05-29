// src/api/specialties.js
import api from './client'

export const getSpecialties = () =>
  api.get('/specialties/')

export const createSpecialty = (data) =>
  api.post('/specialties/', data)

export const updateSpecialty = (id, data) =>
  api.put(`/specialties/${id}/`, data)

export const deactivateSpecialty = (id) =>
  api.delete(`/specialties/${id}/`)
