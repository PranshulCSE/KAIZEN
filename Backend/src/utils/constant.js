 const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

 const ERROR_MESSAGES = {
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Not authorized to access this resource',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error'
};

 const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  FETCHED: 'Resource fetched successfully'
};

 const ROLE_HIERARCHY = {
  'user': 1,
  'admin': 2,
  'super-admin': 3
};

 const FILE_SIZE_LIMITS = {
  RESUME: 5 * 1024 * 1024, // 5MB
  AVATAR: 2 * 1024 * 1024  // 2MB
};

 const ALLOWED_FILE_TYPES = {
  RESUME: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AVATAR: ['image/jpeg', 'image/png', 'image/webp']
};

 const ATS_SCORE_RANGES = {
  EXCELLENT: { min: 80, max: 100, label: 'Excellent' },
  GOOD: { min: 60, max: 79, label: 'Good' },
  AVERAGE: { min: 40, max: 59, label: 'Average' },
  POOR: { min: 0, max: 39, label: 'Needs Improvement' }
};

module.exports={
    HTTP_STATUS,
    ERROR_MESSAGE,
    SUCCESS_MESSAGES,
    ROLE_HIERARCHY,
    FILE_SIZE_LIMITS,
    ALLOWED_FILE_TYPES,
    ATS_SCORE_RANGES
}