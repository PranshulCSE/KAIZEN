import { useCallback, useState } from 'react';
import { aiApi } from '../api/ai.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';

// One small hook covering all four AI actions — each exposes its own
// isLoading flag so a page can drive multiple buttons independently.
export function useAI() {
  const [state, setState] = useState({
    analyzeJob: { isLoading: false, error: null },
    optimizeResume: { isLoading: false, error: null },
    calculateAts: { isLoading: false, error: null },
    interviewQuestions: { isLoading: false, error: null }
  });

  const run = useCallback(async (key, apiCall) => {
    setState((s) => ({ ...s, [key]: { isLoading: true, error: null } }));
    try {
      const { data } = await apiCall();
      setState((s) => ({ ...s, [key]: { isLoading: false, error: null } }));
      return data.data;
    } catch (err) {
      const message = apiErrorMessage(err, 'The AI request failed. Please try again.');
      setState((s) => ({ ...s, [key]: { isLoading: false, error: message } }));
      throw new Error(message);
    }
  }, []);

  return {
    status: state,
    analyzeJob: (payload) => run('analyzeJob', () => aiApi.analyzeJob(payload)),
    optimizeResume: (payload) => run('optimizeResume', () => aiApi.optimizeResume(payload)),
    calculateAts: (payload) => run('calculateAts', () => aiApi.calculateAtsScore(payload)),
    generateInterviewQuestions: (payload) =>
      run('interviewQuestions', () => aiApi.generateInterviewQuestions(payload))
  };
}
