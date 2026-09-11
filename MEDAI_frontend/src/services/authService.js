import api from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    return data.data // { user, access_token }
  },

  async register(payload) {
    // payload: { full_name, email, password, role, ...roleSpecificFields }
    const { data } = await api.post('/auth/register', payload)
    return data.data
  },

  async fetchCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data.data
  },
}
