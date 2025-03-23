
import { API } from "./api";
import { User } from "@/contexts/shared-types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
}

export class AuthService {
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
  
  static async socialLogin(provider: 'google' | 'apple'): Promise<AuthResponse> {
    return API.handleRequest<AuthResponse>("/auth/social-login", "POST", { provider });
  }
  
  static async getAuthUrl(provider: 'google' | 'apple'): Promise<{authUrl: string}> {
    return API.handleRequest<{authUrl: string}>("/auth/get-auth-url", "GET", { provider });
  }
}
