import api from './client'

export const getEPSConfigurations = () =>
  api.get('/eps/')

export const updateEPSConfiguration = (id, data) =>
  api.patch(`/eps/${id}/`, data)