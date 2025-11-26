import axios from 'axios'

const base = '/api/tasks'

export default {
  getAll: () => axios.get(base),
  get: (id) => axios.get(`${base}/${id}`),
  create: (task) => axios.post(base, task),
  update: (id, task) => axios.put(`${base}/${id}`, task),
  delete: (id) => axios.delete(`${base}/${id}`),
}

