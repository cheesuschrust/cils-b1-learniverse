
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
}
