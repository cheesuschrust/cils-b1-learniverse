
import { ApiClient, ApiRequestOptions, ApiResponse, NetworkError, ValidationError } from '@/types/service';

export class HttpApiClient implements ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  
  constructor(baseUrl: string = '/api', defaultTimeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
  }
  
  /**
   * Make a GET request
   */
  public async get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }
  
  /**
   * Make a POST request
   */
  public async post<T, D = any>(url: string, data: D, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }
  
  /**
   * Make a PUT request
   */
  public async put<T, D = any>(url: string, data: D, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, options);
  }
  
  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }
  
  /**
   * Make an HTTP request
   */
  private async request<T>(
    method: string, 
    url: string, 
    data?: any, 
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const requestUrl = `${this.baseUrl}${url}`;
    const controller = new AbortController();
    
    // Set up timeout if provided
    const timeoutMs = options?.timeout ?? this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // Prepare headers
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers
      });
      
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: options?.signal || controller.signal,
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && data !== undefined) {
        fetchOptions.body = JSON.stringify(data);
      }
      
      // Make the request
      const response = await fetch(requestUrl, fetchOptions);
      
      // Parse the response
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      // Check for error responses
      if (!response.ok) {
        if (response.status === 400 && responseData.errors) {
          throw new ValidationError(
            responseData.message || 'Validation failed',
            responseData.errors,
            'VALIDATION_ERROR',
            response.status
          );
        }
        
        const error = new Error(responseData.message || 'Request failed') as any;
        error.status = response.status;
        error.code = responseData.code || 'API_ERROR';
        error.details = responseData.details;
        throw error;
      }
      
      // Return success response
      return {
        data: responseData,
        status: response.status,
        message: responseData.message
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new NetworkError('Request timed out', 'TIMEOUT_ERROR', 408);
      }
      
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        throw new NetworkError('Network error occurred', 'NETWORK_ERROR', 0);
      }
      
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Create and export a singleton instance
export const apiClient = new HttpApiClient();

export default apiClient;
