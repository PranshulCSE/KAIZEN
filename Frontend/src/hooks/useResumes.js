import { useCallback, useEffect, useState } from 'react';
import { resumesApi } from '../api/resumes.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';

export function useResumes() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await resumesApi.list();
      setResumes(data.data.resumes);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load your resumes.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const uploadResume = useCallback(async (file, title, onProgress) => {
    const { data } = await resumesApi.upload(file, title, onProgress);
    setResumes((prev) => [data.data, ...prev]);
    return data.data;
  }, []);

  const removeResume = useCallback(async (id) => {
    await resumesApi.remove(id);
    setResumes((prev) => prev.filter((r) => r._id !== id));
  }, []);

  const downloadResume = useCallback(async (id, title, options) => {
    try {
      const payload = typeof options === 'string' ? { template: options } : (options || {});
      const response = await resumesApi.downloadPdf(id, payload);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanTitle = (title || 'resume').replace(/[^\w\- ]+/g, '').trim() || 'resume';
      link.download = `${cleanTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Failed to download resume PDF.'));
    }
  }, []);

  return {
    resumes,
    isLoading,
    error,
    refetch: fetchResumes,
    uploadResume,
    removeResume,
    downloadResume
  };
}

export function useResume(id) {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResume = useCallback(async () => {
    if (!id) {
      setError('A resume was not specified.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await resumesApi.getById(id);
      setResume(data.data);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load this resume.'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const downloadPdf = useCallback(async (options) => {
    if (!id) return;
    try {
      const payload = typeof options === 'string' 
        ? { template: options, optimization: resume?.optimization }
        : { optimization: resume?.optimization, ...(options || {}) };
      const response = await resumesApi.downloadPdf(id, payload);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanTitle = (resume?.title || 'resume').replace(/[^\w\- ]+/g, '').trim() || 'resume';
      link.download = `${cleanTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Failed to download resume PDF.'));
    }
  }, [id, resume]);

  return { resume, isLoading, error, refetch: fetchResume, setResume, downloadPdf };
}
