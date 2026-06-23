import api from './client'


export const createAppointment = (data) =>
  api.post('/appointments/appointments/', data)


export const getDoctorsBySpecialty = (specialtyId) =>
  api.get('/doctors/', {
    params: {
      specialty: specialtyId
    }
  })


export const getSpecialties = () =>
  api.get('/specialties/')


export const getAvailability = (doctorId, date) =>
  api.get(`/appointments/availability/${doctorId}/`, {
    params: {
      date
    }
  })


export const getMyAppointments = () =>
  api.get('/appointments/my/')

export const rescheduleAppointment = (
    appointmentId,
    data
) =>
    api.patch(
        `/appointments/appointments/${appointmentId}/reschedule/`,
        data
    )

export const cancelAppointment = (appointmentId) =>
    api.patch(
        `/appointments/appointments/${appointmentId}/cancel/`
    )

export const getAppointmentHistory = () =>
  api.get('/appointments/history/')

export const getDoctorAppointments = () => {
    return api.get(
        '/appointments/doctor/appointments/'
    )
}

export const getMyAvailability = () => {
    return api.get(
        '/appointments/my-availability/'
    )
}

export const updateAppointmentStatus = (id, status) => {

    return api.patch(
        `/appointments/doctor/appointments/${id}/status/`,
        {
            status
        }
    )

}

export const getDoctorDashboard = () =>
    api.get(
        '/appointments/doctor/dashboard/'
    )