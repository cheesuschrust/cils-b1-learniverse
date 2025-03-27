
import { API } from "./api";
import { User } from "@/contexts/shared-types";
import { 
  IAuthService, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from "./interfaces/IAuthService";

export class AuthService implements IAuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return API.handleRequest<AuthResponse>("/auth/login", "POST", credentials);
  }
  
  static async register(data: RegisterData): Promise<AuthResponse> {
    return API.handleRequest<AuthResponse>("/auth/register", "POST", data);
  }
  
  static async logout(): Promise<void> {
    // This would make a real API call to invalidate the session
    return Promise.resolve();
  }
  
  static async forgotPassword(email: string): Promise<void> {
    return API.handleRequest<void>("/auth/forgot-password", "POST", { email });
  }
  
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    return API.handleRequest<void>("/auth/reset-password", "POST", { token, newPassword });
  }
  
  static async verifyEmail(token: string): Promise<void> {
    return API.handleRequest<void>("/auth/verify-email", "POST", { token });
  }
  
  static async testConnection(): Promise<{ success: boolean, message: string }> {
    // Mock implementation for test connection
    return Promise.resolve({ 
      success: true, 
      message: 'Auth service connection test successful' 
    });
  }
}
