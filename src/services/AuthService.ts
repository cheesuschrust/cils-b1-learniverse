
import { API } from "./api";
import { User } from "@/types/user";
import { 
  IAuthService, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ServiceError
} from "@/types/service";

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
  
  updateProfile = async (data: Partial<User>): Promise<AuthResponse> => {
    try {
      const userId = data.id; // Assume id is in the data
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
export const login = AuthService.prototype.login;
export const register = AuthService.prototype.register;
export const logout = AuthService.prototype.logout;
export const forgotPassword = AuthService.prototype.forgotPassword;
export const resetPassword = AuthService.prototype.resetPassword;
export const verifyEmail = AuthService.prototype.verifyEmail;
export const testConnection = AuthService.prototype.testConnection;
export const updateProfile = AuthService.prototype.updateProfile;
export const updatePassword = AuthService.prototype.updatePassword;
export const refreshUser = AuthService.prototype.refreshUser;
export const signup = AuthService.prototype.signup;
export const incrementDailyQuestionCount = AuthService.prototype.incrementDailyQuestionCount;
export const resendVerificationEmail = AuthService.prototype.resendVerificationEmail;
export const socialLogin = AuthService.prototype.socialLogin;

// Create a default export
const authService: IAuthService = new AuthService();
export default authService;
