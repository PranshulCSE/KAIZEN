import { client } from './axiosClient.js';

export const adminApi = {
  dashboard: () => client.get('/admin/dashboard'),
  listUsers: (params) => client.get('/admin/users', { params }),
  getUser: (id) => client.get(`/admin/users/${id}`),
  updateRole: (id, role) => client.put(`/admin/users/${id}/role`, { role }),
  toggleVerification: (id) => client.put(`/admin/users/${id}/verify`),
  listResumes: (params) => client.get('/admin/resumes', { params })
};
