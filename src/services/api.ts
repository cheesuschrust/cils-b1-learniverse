
import { toast } from "@/hooks/use-toast";

interface APIOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

interface APIErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

class APIClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;
  private withCredentials: boolean;
  
  constructor(options: APIOptions = {}) {
    this.baseURL = options.baseURL || '/api';
    this.timeout = options.timeout || 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.withCredentials = options.withCredentials || true;
  }
  
  // Add a cache to prevent redundant calls
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private cacheExpiration = 60000; // 1 minute cache
  
  async handleRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data: any = null, 
    customHeaders: Record<string, string> = {},
    skipCache = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // For GET requests, check cache first
    if (method === 'GET' && !skipCache) {
      const cacheKey = `${method}:${url}:${JSON.stringify(data)}`;
      const cachedItem = this.cache.get(cacheKey);
      
      if (cachedItem && (Date.now() - cachedItem.timestamp < this.cacheExpiration)) {
        console.log(`Using cached data for ${cacheKey}`);
        return cachedItem.data;
      }
    }
    
    const options: RequestInit = {
      method,
      headers: {
        ...this.headers,
        ...customHeaders
      },
      credentials: this.withCredentials ? 'include' : 'same-origin'
    };
    
    if (data) {
      if (method === 'GET') {
        // Convert data to query params
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          endpoint += (endpoint.includes('?') ? '&' : '?') + queryString;
        }
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    // Implement a timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request to ${endpoint} timed out after ${this.timeout}ms`));
      }, this.timeout);
    });
    
    try {
      // Race the fetch against the timeout
      const controller = new AbortController();
      options.signal = controller.signal;
      
      // Simulate API response for demo purposes
      const responsePromise = new Promise<T>((resolve) => {
        setTimeout(() => {
          // Create a dummy successful response based on the endpoint
          const simulatedResponse = this.simulateResponse<T>(endpoint, method, data);
          resolve(simulatedResponse);
        }, 300); // Simulate network latency but keep it fast
      });
      
      const response = await Promise.race([responsePromise, timeoutPromise]);
      
      // For GET requests, update the cache
      if (method === 'GET') {
        const cacheKey = `${method}:${url}:${JSON.stringify(data)}`;
        this.cache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }
      
      return response;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
        
      throw new Error(errorMessage);
    }
  }
  
  // Simulate API responses for demo purposes
  private simulateResponse<T>(endpoint: string, method: string, data: any): T {
    console.log(`Simulating API response for ${method} ${endpoint}`);
    
    // Handle specific endpoints
    if (endpoint.includes('/auth/login')) {
      return {
        user: {
          id: 'user1',
          email: data.email || 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          status: 'active',
          subscription: 'free',
          createdAt: new Date().toISOString(),
          preferences: {
            darkMode: false,
            notifications: true,
            language: 'english'
          }
        }
      } as unknown as T;
    }
    
    if (endpoint.includes('/auth/register')) {
      return {
        user: {
          id: 'user' + Date.now(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user',
          status: 'active',
          subscription: 'free',
          createdAt: new Date().toISOString(),
          preferences: {
            darkMode: false,
            notifications: true,
            language: 'english'
          }
        }
      } as unknown as T;
    }
    
    if (endpoint.includes('/user/profile')) {
      return {
        user: {
          id: data.userId || 'user1',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          status: 'active',
          subscription: 'premium',
          createdAt: new Date().toISOString(),
          preferences: {
            darkMode: true,
            notifications: true,
            language: 'english'
          },
          voicePreference: {
            italianVoiceURI: 'Luca',
            englishVoiceURI: 'Daniel',
            voiceRate: 1.0,
            voicePitch: 1.0
          }
        }
      } as unknown as T;
    }
    
    if (endpoint.includes('/user/update')) {
      const userData = data.userData;
      return {
        user: {
          id: data.userId,
          email: 'user@example.com',
          firstName: userData.firstName || 'John',
          lastName: userData.lastName || 'Doe',
          role: 'user',
          status: 'active',
          subscription: 'premium',
          createdAt: new Date().toISOString(),
          preferences: userData.preferences || {
            darkMode: true,
            notifications: true,
            language: 'english'
          },
          voicePreference: userData.voicePreference || {
            italianVoiceURI: 'Luca',
            englishVoiceURI: 'Daniel',
            voiceRate: 1.0,
            voicePitch: 1.0
          }
        }
      } as unknown as T;
    }
    
    if (endpoint.includes('/admin/users/stats')) {
      return {
        totalUsers: 128,
        activeUsers: 98,
        inactiveUsers: 30,
        premiumUsers: 42
      } as unknown as T;
    }
    
    if (endpoint.includes('/admin/logs')) {
      return {
        totalLogs: 312,
        errorLogs: 12,
        warningLogs: 45,
        infoLogs: 255,
        recentLogs: [
          {
            id: '1',
            level: 'error',
            action: 'Failed login attempt',
            details: 'Multiple failed login attempts from IP 192.168.1.1',
            category: 'security',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            level: 'warning',
            action: 'Content upload partially processed',
            details: 'Large PDF file took too long to process completely',
            category: 'content',
            timestamp: new Date(Date.now() - 60000).toISOString()
          },
          {
            id: '3',
            level: 'info',
            action: 'New user registered',
            details: 'User registration completed successfully',
            category: 'user',
            timestamp: new Date(Date.now() - 120000).toISOString()
          }
        ]
      } as unknown as T;
    }
    
    // Generic success response
    return { success: true } as unknown as T;
  }
  
  clearCache() {
    this.cache.clear();
  }
}

export const API = new APIClient();
