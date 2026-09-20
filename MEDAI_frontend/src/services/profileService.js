import api from './api'

export const profileService = {
  async get() {
    const { data } = await api.get('/auth/me')
    return data.data
  },

  async update(payload) {
    const { data } = await api.patch('/auth/me', payload)
    return data.data
  },
}
