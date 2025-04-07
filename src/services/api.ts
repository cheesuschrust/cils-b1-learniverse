
// Basic API client for handling HTTP requests

interface ApiOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class API {
  private static baseUrl: string = "/api";
  private static defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  private static timeout: number = 30000; // 30 seconds
  
  static configure(options: ApiOptions) {
    if (options.baseUrl) this.baseUrl = options.baseUrl;
    if (options.headers) this.defaultHeaders = { ...this.defaultHeaders, ...options.headers };
    if (options.timeout) this.timeout = options.timeout;
  }
  
  static async handleRequest<T>(
    endpoint: string, 
    method: string = "GET", 
    data?: any, 
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      options.signal = controller.signal;
      
      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          statusText: response.statusText,
          message: errorData.message || 'Request failed',
          details: errorData,
          code: errorData.code || 'API_ERROR'
        };
      }
      
      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }
      
      // Check content type to determine parsing method
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        try {
          return JSON.parse(text) as T;
        } catch (e) {
          return text as unknown as T;
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          code: 'TIMEOUT',
          status: 408
        };
      }
      throw error;
    }
  }
  
  static async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest<T>(endpoint, 'GET', undefined, headers);
  }
  
  static async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest<T>(endpoint, 'POST', data, headers);
  }
  
  static async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest<T>(endpoint, 'PUT', data, headers);
  }
  
  static async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest<T>(endpoint, 'PATCH', data, headers);
  }
  
  static async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest<T>(endpoint, 'DELETE', undefined, headers);
  }
}
