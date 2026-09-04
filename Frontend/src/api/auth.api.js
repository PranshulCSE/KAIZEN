import { client } from './axiosClient.js';

export const authApi = {
  register: (payload) => client.post('/auth/register', payload),
  verifyOtp: (payload) => client.post('/auth/verify-otp', payload),
  resendOtp: (email) => client.post('/auth/resend-otp', { email }),
  login: (payload) => client.post('/auth/login', payload),
  logout: () => client.post('/auth/logout'),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => client.post('/auth/reset-password', payload)
};
