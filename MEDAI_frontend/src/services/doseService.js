import api from './api'

export const doseService = {
  async today() {
    const { data } = await api.get('/doses/today')
    return data.data
  },

  async history(params = {}) {
    const { data } = await api.get('/doses/history', { params })
    return data.data
  },

  async markTaken(doseId) {
    const { data } = await api.post(`/doses/${doseId}/taken`)
    return data.data
  },

  async markMissed(doseId) {
    const { data } = await api.post(`/doses/${doseId}/missed`)
    return data.data
  },
}
