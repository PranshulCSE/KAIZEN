import { useCallback, useEffect, useState } from 'react';
import { jobsApi } from '../api/jobs.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';

export function useJobAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await jobsApi.list();
      setAnalyses(data.data.analyses);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load job analyses.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const removeAnalysis = useCallback(async (id) => {
    await jobsApi.remove(id);
    setAnalyses((prev) => prev.filter((a) => a._id !== id));
  }, []);

  return { analyses, isLoading, error, refetch: fetchAnalyses, removeAnalysis };
}

export function useJobAnalysis(id) {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    jobsApi
      .getById(id)
      .then(({ data }) => setAnalysis(data.data))
      .catch((err) => setError(apiErrorMessage(err, 'Could not load this analysis.')))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { analysis, isLoading, error };
}
