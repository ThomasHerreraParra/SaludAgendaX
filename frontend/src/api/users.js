import api from './client'

export const getMe = () => {
  return api.get('/me/')
}

export const getProfile = () =>
    api.get('/me/')

export const updateProfile = (data) =>
    api.patch('/me/update/', data)