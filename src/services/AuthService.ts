
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
    console.log("Logging in with credentials:", credentials);
    return API.handleRequest<AuthResponse>("/auth/login", "POST", credentials);
  }
  
  static async register(data: RegisterData): Promise<AuthResponse> {
    console.log("Registering new user:", data);
    return API.handleRequest<AuthResponse>("/auth/register", "POST", data);
  }
  
  static async logout(): Promise<void> {
    console.log("Logging out user");
    return API.handleRequest<void>("/auth/logout", "POST", {});
  }
  
  static async forgotPassword(email: string): Promise<void> {
    console.log("Sending password reset email to:", email);
    return API.handleRequest<void>("/auth/forgot-password", "POST", { email });
  }
  
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    console.log("Resetting password with token");
    return API.handleRequest<void>("/auth/reset-password", "POST", { token, newPassword });
  }
  
  static async verifyEmail(token: string): Promise<void> {
    console.log("Verifying email with token");
    return API.handleRequest<void>("/auth/verify-email", "POST", { token });
  }
  
  static async socialLogin(provider: 'google' | 'apple'): Promise<AuthResponse> {
    console.log(`Logging in with ${provider}`);
    // In a real implementation, this would redirect to the OAuth provider
    // For now, simulate a successful login with the provider
    return API.handleRequest<AuthResponse>("/auth/social-login", "POST", { provider });
  }
  
  static async getAuthUrl(provider: 'google' | 'apple'): Promise<{authUrl: string}> {
    console.log(`Getting ${provider} auth URL`);
    // In real implementation, this would get a URL from the backend to redirect to
    const url = provider === 'google' 
      ? 'https://accounts.google.com/o/oauth2/auth' 
      : 'https://appleid.apple.com/auth/authorize';
      
    return Promise.resolve({ authUrl: url });
  }
  
  static async handleOAuthCallback(provider: 'google' | 'apple', code: string): Promise<AuthResponse> {
    console.log(`Handling ${provider} OAuth callback with code`);
    return API.handleRequest<AuthResponse>("/auth/oauth-callback", "POST", { provider, code });
  }
}
