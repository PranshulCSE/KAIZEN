import { client } from './axiosClient.js';

export const aiApi = {
  analyzeJob: (payload) => client.post('/ai/analyze-job', payload),
  optimizeResume: (payload) => client.post('/ai/optimize-resume', payload),
  calculateAtsScore: (payload) => client.post('/ai/calculate-ats', payload),
  generateInterviewQuestions: (payload) => client.post('/ai/generate-questions', payload)
};
