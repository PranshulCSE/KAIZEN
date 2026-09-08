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
  ANALYZE_JOB: '/app/jobs/new',
  OPTIMIZE: '/app/optimize',

  ADMIN: '/app/admin',
  ADMIN_USERS: '/app/admin/users',
  ADMIN_LOGS: '/app/admin/logs',

  NOT_FOUND: '*'
};

export const resumeDetailPath = (id) => `/app/resumes/${id}`;
export const jobAnalysisDetailPath = (id) => `/app/jobs/${id}`;
