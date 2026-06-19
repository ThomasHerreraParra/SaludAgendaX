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

export const getAvailability = (
doctorId,
date
)=>

api.get(
`/appointments/availability/${doctorId}/`,
{
params:{
date
}
}
)