
export enum ErrorCategory {
  USER_INPUT = 'user_input',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  DATABASE_ERROR = 'database_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  PERMISSION_ERROR = 'permission_error',
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND = 'not_found',
  TIMEOUT_ERROR = 'timeout_error',
  UNKNOWN_ERROR = 'unknown_error',
  FEATURE_FLAG = 'feature_flag',
  AI_SERVICE = 'ai_service'
}

export default ErrorCategory;
