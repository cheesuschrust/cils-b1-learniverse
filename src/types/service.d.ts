
import { User } from './user';
import { DocumentMeta, ParsedDocument } from './document';
import { Result, ApiResponse } from './index';

// Auth Service Types
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
  token?: string;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  testConnection(): Promise<{ success: boolean, message: string }>;
}

// Document Service Types
export interface IDocumentService {
  uploadDocument(file: File, userId: string): Promise<{ path: string; url: string }>;
  parseDocumentContent(content: string, fileType: string): Promise<ParsedDocument>;
  saveDocumentMetadata(
    meta: Omit<DocumentMeta, 'id' | 'createdAt'>,
    parsedContent: ParsedDocument
  ): Promise<string>;
}

// Generic Service Factory Interface
export interface ServiceFactory {
  authService: IAuthService;
  documentService: IDocumentService;
  // Add other services as they are implemented
}

// API Request/Response Types
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

export interface ApiClient {
  get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  post<T, D = any>(url: string, data: D, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  put<T, D = any>(url: string, data: D, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
}

// Error Types for Services
export interface ServiceError extends Error {
  code: string;
  status: number;
  details?: Record<string, any>;
}

export class NetworkError extends Error implements ServiceError {
  code: string;
  status: number;
  details?: Record<string, any>;
  
  constructor(message: string, code: string = 'NETWORK_ERROR', status: number = 0) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.status = status;
  }
}

export class AuthenticationError extends Error implements ServiceError {
  code: string;
  status: number;
  details?: Record<string, any>;
  
  constructor(message: string = 'Authentication failed', code: string = 'AUTH_ERROR', status: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.status = status;
  }
}

export class ValidationError extends Error implements ServiceError {
  code: string;
  status: number;
  details: Record<string, string[]>;
  
  constructor(message: string, details: Record<string, string[]>, code: string = 'VALIDATION_ERROR', status: number = 400) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
