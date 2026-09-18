import api from './api'

export const medicationService = {
  async list() {
    const { data } = await api.get('/medications')
    return data.data
  },

  async create(payload) {
    // payload: { medicine_name, dosage_description, frequency, instructions,
    //            start_date, end_date, schedules: [{ scheduled_time, days_of_week }] }
    const { data } = await api.post('/medications', payload)
    return data.data
  },

  async update(id, payload) {
    const { data } = await api.put(`/medications/${id}`, payload)
    return data.data
  },

  async remove(id) {
    await api.delete(`/medications/${id}`)
  },

  async addSchedule(medicationId, payload) {
    const { data } = await api.post(`/medications/${medicationId}/schedules`, payload)
    return data.data
  },
}
