import { client } from './axiosClient.js';

export const resumesApi = {
    upload: (file, title, onUploadProgress) => {
        const form = new FormData();
        form.append('resume', file);
        if (title) form.append('title', title);
        return client.post('/resumes/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
        });
    },
    create: (payload) => client.post('/resumes', payload),
    list: (params) => client.get('/resumes', { params }),
    getById: (id) => client.get(`/resumes/${id}`),
    update: (id, payload) => client.put(`/resumes/${id}`, payload),
    remove: (id) => client.delete(`/resumes/${id}`),
    downloadPdf: (id, optimization) =>
        client.post(`/resumes/${id}/download`, { optimization }, { responseType: 'blob' })
};
