import api from './client'

export const getMe = () => {
  return api.get('/me/')
}

export const getProfile = () =>
    api.get('/me/')

export const updateProfile = (data) =>
    api.patch('/me/update/', data)

export const getGlobalConfiguration = () =>
    api.get('/users/global-configuration/')

export const updateGlobalConfiguration = (data) =>
    api.patch('/users/global-configuration/', data)