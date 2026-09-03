export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ACCESS_TOKEN_KEY = 'kaizen_access_token';
export const REFRESH_TOKEN_KEY = 'kaizen_refresh_token';

export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const MAX_RESUME_SIZE_MB = 5;
