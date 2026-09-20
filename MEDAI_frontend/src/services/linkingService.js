import api from './api'

export const linkingService = {
  // Caregiver side
  async sendLinkRequest(patientEmail) {
    const { data } = await api.post('/caregiver/link-requests', { patient_email: patientEmail })
    return data
  },
  async linkedPatients() {
    const { data } = await api.get('/caregiver/patients')
    return data.data
  },

  // Patient side
  async pendingRequests() {
    const { data } = await api.get('/patient/link-requests')
    return data.data
  },
  async approve(linkId) {
    const { data } = await api.post(`/patient/link-requests/${linkId}/approve`)
    return data
  },
  async reject(linkId) {
    const { data } = await api.post(`/patient/link-requests/${linkId}/reject`)
    return data
  },
}
