import api from './api'

export const adherenceService = {
  async summary(period = 'weekly') {
    const { data } = await api.get('/adherence/summary', { params: { period } })
    return data.data
  },

  async trends(period = 'weekly') {
    const { data } = await api.get('/adherence/trends', { params: { period } })
    return data.data
  },

  async medicationWise() {
    const { data } = await api.get('/adherence/medication-wise')
    return data.data
  },

  async patterns() {
    const { data } = await api.get('/adherence/patterns')
    return data.data
  },

  async risk() {
    const { data } = await api.get('/adherence/risk')
    return data.data
  },
}
