
import { API } from "./api";
import { User } from "@/types/user";
import { 
  IAuthService, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from "@/services/interfaces/IAuthService";

// Define ServiceError interface
interface ServiceError extends Error {
  name: string;
  message: string;
  code: string;
  status: number;
  details?: any;
}

export class AuthService implements IAuthService {
  login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      return await API.handleRequest<AuthResponse>("/auth/login", "POST", credentials);
    } catch (error) {
      console.error("Login error:", error);
      throw this.formatError(error, "Authentication failed");
    }
  };
  
  register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      return await API.handleRequest<AuthResponse>("/auth/register", "POST", data);
    } catch (error) {
      console.error("Registration error:", error);
      throw this.formatError(error, "Registration failed");
    }
  };
  
  signup = async (data: RegisterData): Promise<AuthResponse> => {
    return this.register(data); // Alias for register
  };
  
  logout = async (): Promise<void> => {
    // This would make a real API call to invalidate the session
    return Promise.resolve();
  };
  
  forgotPassword = async (email: string): Promise<void> => {
    try {
      return await API.handleRequest<void>("/auth/forgot-password", "POST", { email });
    } catch (error) {
      console.error("Forgot password error:", error);
      throw this.formatError(error, "Failed to process password reset request");
    }
  };
  
  resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      return await API.handleRequest<void>("/auth/reset-password", "POST", { token, newPassword });
    } catch (error) {
      console.error("Reset password error:", error);
      throw this.formatError(error, "Failed to reset password");
    }
  };
  
  verifyEmail = async (token: string): Promise<void> => {
    try {
      return await API.handleRequest<void>("/auth/verify-email", "POST", { token });
    } catch (error) {
      console.error("Email verification error:", error);
      throw this.formatError(error, "Failed to verify email");
    }
  };
  
  testConnection = async (): Promise<{ success: boolean, message: string }> => {
    // Mock implementation for test connection
    return Promise.resolve({ 
      success: true, 
      message: 'Auth service connection test successful' 
    });
  };
  
  updateProfile = async (userId: string, data: Partial<User>): Promise<AuthResponse> => {
    try {
      return await API.handleRequest<AuthResponse>(`/users/${userId}`, "PUT", data);
    } catch (error) {
      console.error("Update profile error:", error);
      throw this.formatError(error, "Failed to update profile");
    }
  };
  
  updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      // Assume auth is handled by API client/interceptors
      return await API.handleRequest<void>(`/auth/password`, "PUT", { currentPassword, newPassword });
    } catch (error) {
      console.error("Update password error:", error);
      throw this.formatError(error, "Failed to update password");
    }
  };
  
  refreshUser = async (): Promise<User> => {
    try {
      const response = await API.handleRequest<{ user: User }>("/auth/me", "GET");
      return response.user;
    } catch (error) {
      console.error("Refresh user error:", error);
      throw this.formatError(error, "Failed to refresh user data");
    }
  };
  
  incrementDailyQuestionCount = async (questionType: string): Promise<boolean> => {
    try {
      await API.handleRequest<void>("/user/daily-question-count", "POST", { questionType });
      return true;
    } catch (error) {
      console.error("Increment daily question count error:", error);
      return false;
    }
  };
  
  resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      await API.handleRequest<void>("/auth/resend-verification", "POST", { email });
      return true;
    } catch (error) {
      console.error("Resend verification email error:", error);
      return false;
    }
  };
  
  socialLogin = async (provider: string): Promise<boolean> => {
    try {
      await API.handleRequest<void>(`/auth/social/${provider}`, "GET");
      return true;
    } catch (error) {
      console.error(`Social login (${provider}) error:`, error);
      return false;
    }
  };
  
  // New methods to match interface
  getEmailSettings = async (): Promise<any> => {
    try {
      return await API.handleRequest<any>("/email/settings", "GET");
    } catch (error) {
      console.error("Get email settings error:", error);
      throw this.formatError(error, "Failed to fetch email settings");
    }
  };

  updateEmailSettings = async (settings: any): Promise<void> => {
    try {
      return await API.handleRequest<void>("/email/settings", "PUT", settings);
    } catch (error) {
      console.error("Update email settings error:", error);
      throw this.formatError(error, "Failed to update email settings");
    }
  };

  getSystemLogs = async (): Promise<any[]> => {
    try {
      const response = await API.handleRequest<{logs: any[]}>("/system/logs", "GET");
      return response.logs || [];
    } catch (error) {
      console.error("Get system logs error:", error);
      throw this.formatError(error, "Failed to fetch system logs");
    }
  };

  updateSystemLog = async (id: string, data: any): Promise<void> => {
    try {
      return await API.handleRequest<void>(`/system/logs/${id}`, "PUT", data);
    } catch (error) {
      console.error("Update system log error:", error);
      throw this.formatError(error, "Failed to update system log");
    }
  };

  addSystemLog = (action: string, details: string, level: string = "info"): void => {
    // For client-side logging, we'll just log to console
    // In a real implementation, this might queue logs to be sent to the server
    console.log(`[${level.toUpperCase()}] ${action}: ${details}`);
    
    // In a real implementation, we might do something like:
    // this.systemLogQueue.push({ action, details, level, timestamp: new Date() });
    // this.processPendingLogs();
  };
  
  private formatError(error: any, defaultMessage: string): ServiceError {
    // Return a standardized error format
    return {
      name: 'AuthServiceError',
      message: error.message || defaultMessage,
      code: error.code || 'AUTH_ERROR',
      status: error.status || 500,
      details: error.details || undefined
    };
  }
}

// Export static methods for backward compatibility
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new AuthService().login(credentials);
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return new AuthService().register(data);
};

export const logout = async (): Promise<void> => {
  return new AuthService().logout();
};

export const forgotPassword = async (email: string): Promise<void> => {
  return new AuthService().forgotPassword(email);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  return new AuthService().resetPassword(token, newPassword);
};

export const verifyEmail = async (token: string): Promise<void> => {
  return new AuthService().verifyEmail(token);
};

export const testConnection = async (): Promise<{ success: boolean, message: string }> => {
  return new AuthService().testConnection();
};

export const updateProfile = async (userId: string, data: Partial<User>): Promise<AuthResponse> => {
  return new AuthService().updateProfile(userId, data);
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  return new AuthService().updatePassword(currentPassword, newPassword);
};

export const refreshUser = async (): Promise<User> => {
  return new AuthService().refreshUser();
};

export const signup = async (data: RegisterData): Promise<AuthResponse> => {
  return new AuthService().signup(data);
};

export const incrementDailyQuestionCount = async (questionType: string): Promise<boolean> => {
  return new AuthService().incrementDailyQuestionCount(questionType);
};

export const resendVerificationEmail = async (email: string): Promise<boolean> => {
  return new AuthService().resendVerificationEmail(email);
};

export const socialLogin = async (provider: string): Promise<boolean> => {
  return new AuthService().socialLogin(provider);
};

export const getEmailSettings = async (): Promise<any> => {
  return new AuthService().getEmailSettings();
};

export const updateEmailSettings = async (settings: any): Promise<void> => {
  return new AuthService().updateEmailSettings(settings);
};

export const getSystemLogs = async (): Promise<any[]> => {
  return new AuthService().getSystemLogs();
};

export const updateSystemLog = async (id: string, data: any): Promise<void> => {
  return new AuthService().updateSystemLog(id, data);
};

export const addSystemLog = (action: string, details: string, level: string = "info"): void => {
  return new AuthService().addSystemLog(action, details, level);
};

// Create a default export
const authService: IAuthService = new AuthService();
export default authService;
