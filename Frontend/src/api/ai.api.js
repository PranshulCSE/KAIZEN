import { client } from './axiosClient.js';

export const aiApi = {
  analyzeJob: (payload) => client.post('/ai/analyze-job', payload),
  optimizeResume: (payload) => client.post('/ai/optimize-resume', payload),
  calculateAtsScore: (payload) => client.post('/ai/calculate-ats', payload),
  generateInterviewQuestions: (payload) => client.post('/ai/generate-questions', payload),
  generateCoverLetter: (payload) => client.post('/ai/cover-letter', payload),
  generateColdOutreach: (payload) => client.post('/ai/cold-outreach', payload),
  getGitHubRepos: (payload) => client.post('/ai/github-repos', payload),
  generateGitHubBullets: (payload) => client.post('/ai/github-bullets', payload),
  scrapeJobUrl: (payload) => client.post('/ai/scrape-job-url', payload)
};
