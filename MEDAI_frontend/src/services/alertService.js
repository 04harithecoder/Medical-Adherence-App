import api from './api'

export const alertService = {
  async list() {
    const { data } = await api.get('/alerts')
    return data.data
  },
  async resolve(id) {
    const { data } = await api.patch(`/alerts/${id}/resolve`)
    return data
  },
}
