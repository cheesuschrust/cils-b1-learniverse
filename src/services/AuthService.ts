
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
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      return await API.handleRequest<AuthResponse>("/auth/login", "POST", credentials);
    } catch (error) {
      console.error("Login error:", error);
      throw this.formatError(error, "Authentication failed");
    }
  }
  
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      return await API.handleRequest<AuthResponse>("/auth/register", "POST", data);
    } catch (error) {
      console.error("Registration error:", error);
      throw this.formatError(error, "Registration failed");
    }
  }
  
  static async logout(): Promise<void> {
    // This would make a real API call to invalidate the session
    return Promise.resolve();
  }
  
  static async forgotPassword(email: string): Promise<void> {
    try {
      return await API.handleRequest<void>("/auth/forgot-password", "POST", { email });
    } catch (error) {
      console.error("Forgot password error:", error);
      throw this.formatError(error, "Failed to process password reset request");
    }
  }
  
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      return await API.handleRequest<void>("/auth/reset-password", "POST", { token, newPassword });
    } catch (error) {
      console.error("Reset password error:", error);
      throw this.formatError(error, "Failed to reset password");
    }
  }
  
  static async verifyEmail(token: string): Promise<void> {
    try {
      return await API.handleRequest<void>("/auth/verify-email", "POST", { token });
    } catch (error) {
      console.error("Email verification error:", error);
      throw this.formatError(error, "Failed to verify email");
    }
  }
  
  static async testConnection(): Promise<{ success: boolean, message: string }> {
    // Mock implementation for test connection
    return Promise.resolve({ 
      success: true, 
      message: 'Auth service connection test successful' 
    });
  }
  
  static async updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse> {
    try {
      return await API.handleRequest<AuthResponse>(`/users/${userId}`, "PUT", data);
    } catch (error) {
      console.error("Update profile error:", error);
      throw this.formatError(error, "Failed to update profile");
    }
  }
  
  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      return await API.handleRequest<void>(`/users/${userId}/password`, "PUT", { newPassword });
    } catch (error) {
      console.error("Update password error:", error);
      throw this.formatError(error, "Failed to update password");
    }
  }
  
  static async refreshUser(): Promise<User> {
    try {
      const response = await API.handleRequest<{ user: User }>("/auth/me", "GET");
      return response.user;
    } catch (error) {
      console.error("Refresh user error:", error);
      throw this.formatError(error, "Failed to refresh user data");
    }
  }
  
  static async signup(data: RegisterData): Promise<AuthResponse> {
    return this.register(data); // Alias for register
  }
  
  static async incrementDailyQuestionCount(questionType: string): Promise<boolean> {
    try {
      await API.handleRequest<void>("/user/daily-question-count", "POST", { questionType });
      return true;
    } catch (error) {
      console.error("Increment daily question count error:", error);
      return false;
    }
  }
  
  static async resendVerificationEmail(email: string): Promise<boolean> {
    try {
      await API.handleRequest<void>("/auth/resend-verification", "POST", { email });
      return true;
    } catch (error) {
      console.error("Resend verification email error:", error);
      return false;
    }
  }
  
  static async socialLogin(provider: string): Promise<boolean> {
    try {
      await API.handleRequest<void>(`/auth/social/${provider}`, "GET");
      return true;
    } catch (error) {
      console.error(`Social login (${provider}) error:`, error);
      return false;
    }
  }
  
  // Helper method to format errors consistently
  private static formatError(error: unknown, defaultMessage: string): ServiceError {
    if (error instanceof Error) {
      return {
        ...error,
        code: (error as ServiceError).code || 'AUTH_ERROR',
        status: (error as ServiceError).status || 500,
        message: error.message || defaultMessage
      } as ServiceError;
    }
    
    return {
      name: 'AuthError',
      message: typeof error === 'string' ? error : defaultMessage,
      code: 'AUTH_ERROR',
      status: 500
    } as ServiceError;
  }
  
  // Implement required interface methods 
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return AuthService.login(credentials);
  }
  
  register(data: RegisterData): Promise<AuthResponse> {
    return AuthService.register(data);
  }
  
  logout(): Promise<void> {
    return AuthService.logout();
  }
  
  forgotPassword(email: string): Promise<void> {
    return AuthService.forgotPassword(email);
  }
  
  resetPassword(token: string, newPassword: string): Promise<void> {
    return AuthService.resetPassword(token, newPassword);
  }
  
  verifyEmail(token: string): Promise<void> {
    return AuthService.verifyEmail(token);
  }
  
  testConnection(): Promise<{ success: boolean, message: string }> {
    return AuthService.testConnection();
  }
  
  updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse> {
    return AuthService.updateProfile(userId, data);
  }
  
  updatePassword(userId: string, newPassword: string): Promise<void> {
    return AuthService.updatePassword(userId, newPassword);
  }
  
  refreshUser(): Promise<User> {
    return AuthService.refreshUser();
  }
  
  signup(data: RegisterData): Promise<AuthResponse> {
    return AuthService.signup(data);
  }
  
  incrementDailyQuestionCount(questionType: string): Promise<boolean> {
    return AuthService.incrementDailyQuestionCount(questionType);
  }
  
  resendVerificationEmail(email: string): Promise<boolean> {
    return AuthService.resendVerificationEmail(email);
  }
  
  socialLogin(provider: string): Promise<boolean> {
    return AuthService.socialLogin(provider);
  }
}
