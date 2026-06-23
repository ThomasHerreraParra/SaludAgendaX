import api from './client'

export const getDoctorAppointments = () =>
    api.get('/appointments/doctor/appointments/')

export const getMyAvailability = () =>
    api.get('/appointments/my-availability/')