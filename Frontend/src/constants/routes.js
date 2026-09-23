export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/app',
  RESUMES: '/app/resumes',
  RESUME_DETAIL: '/app/resumes/:id',
  JOB_ANALYSES: '/app/jobs',
  JOB_ANALYSIS_DETAIL: '/app/jobs/:id',
  OPTIMIZE: '/app/optimize',
  BUILDER: '/app/builder',
  COVER_LETTER: '/app/cover-letter',
  GITHUB_IMPORT: '/app/github-import',
  MOCK_INTERVIEW: '/app/mock-interview',

  ADMIN: '/app/admin',
  ADMIN_USERS: '/app/admin/users',
  ADMIN_LOGS: '/app/admin/logs',

  NOT_FOUND: '*'
};

export const resumeDetailPath = (id) => `/app/resumes/${id}`;
export const resumeBuilderPath = (id) => `/app/builder${id ? `?resumeId=${id}` : ''}`;
export const jobAnalysisDetailPath = (id) => `/app/jobs/${id}`;
