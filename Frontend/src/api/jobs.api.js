import { client } from './axiosClient.js';

export const jobsApi = {
  list: (params) => client.get('/jobs', { params }),
  getById: (id) => client.get(`/jobs/${id}`),
  remove: (id) => client.delete(`/jobs/${id}`)
};
