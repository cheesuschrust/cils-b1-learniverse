
import { supabase } from '@/integrations/supabase/client';
import { errorMonitoring, ErrorCategory } from '@/utils/errorMonitoring';

// Cache TTL in milliseconds
const DEFAULT_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

// Cache storage
const cache: Record<string, CacheEntry<any>> = {};

// Request options interface
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cacheOptions?: {
    ttl?: number;
    bypassCache?: boolean;
    useStaleWhileRevalidate?: boolean;
  };
  retry?: {
    count: number;
    delayMs: number;
  };
}

// API response interface
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fromCache: boolean;
  status?: number;
  statusText?: string;
  offline?: boolean;
}

// Rate limiting configuration
interface RateLimitConfig {
  interval: number;
  maxRequests: number;
}

// Rate limiting state
const rateLimits: Record<string, { count: number, resetTime: number }> = {};

// Default API options
const defaultOptions: ApiRequestOptions = {
  method: 'GET',
  cacheOptions: {
    ttl: DEFAULT_CACHE_TTL,
    bypassCache: false,
    useStaleWhileRevalidate: true
  },
  retry: {
    count: 3,
    delayMs: 1000
  }
};

/**
 * Check if the current request is rate limited
 */
function checkRateLimit(endpoint: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  
  if (!rateLimits[endpoint]) {
    rateLimits[endpoint] = { count: 1, resetTime: now + config.interval };
    return false;
  }
  
  // Reset counter if interval has passed
  if (now >= rateLimits[endpoint].resetTime) {
    rateLimits[endpoint] = { count: 1, resetTime: now + config.interval };
    return false;
  }
  
  // Check if we've exceeded the rate limit
  if (rateLimits[endpoint].count >= config.maxRequests) {
    return true;
  }
  
  // Increment request count
  rateLimits[endpoint].count++;
  return false;
}

/**
 * Get a value from cache if it exists and is not expired
 */
function getFromCache<T>(key: string, ttl: number = DEFAULT_CACHE_TTL): CacheEntry<T> | null {
  const entry = cache[key];
  if (!entry) return null;
  
  // Check if cache is expired
  if (Date.now() - entry.timestamp > ttl) {
    return null;
  }
  
  return entry;
}

/**
 * Set a value in cache
 */
function setInCache<T>(key: string, data: T, etag?: string): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
    etag
  };
}

/**
 * Generate a cache key from an endpoint and options
 */
function generateCacheKey(endpoint: string, options: ApiRequestOptions): string {
  const { method, body } = options;
  
  // For GET requests, use endpoint as key
  if (method === 'GET' || !method) {
    return `${endpoint}`;
  }
  
  // For non-GET requests, include method and body in key
  return `${method}:${endpoint}:${JSON.stringify(body || {})}`;
}

/**
 * Handle retry logic for failed requests
 */
async function retryRequest<T>(
  endpoint: string, 
  options: ApiRequestOptions, 
  attemptCount: number
): Promise<ApiResponse<T>> {
  try {
    if (attemptCount <= 0) {
      throw new Error(`Request to ${endpoint} failed after all retry attempts`);
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, options.retry?.delayMs || 1000));
    
    // Try request again with decremented retry count
    const newOptions = {
      ...options,
      retry: {
        ...(options.retry || { count: 0, delayMs: 1000 }),
        count: (options.retry?.count || 0) - 1
      }
    };
    
    return await apiRequest(endpoint, newOptions);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      loading: false,
      fromCache: false,
      offline: !navigator.onLine
    };
  }
}

/**
 * Make an API request with caching and error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  // Merge options with defaults
  const mergedOptions: ApiRequestOptions = {
    ...defaultOptions,
    ...options,
    cacheOptions: {
      ...defaultOptions.cacheOptions,
      ...(options.cacheOptions || {})
    },
    retry: {
      ...defaultOptions.retry,
      ...(options.retry || {})
    }
  };
  
  const {
    method = 'GET',
    headers = {},
    body,
    cacheOptions,
    retry
  } = mergedOptions;
  
  try {
    // Generate cache key
    const cacheKey = generateCacheKey(endpoint, mergedOptions);
    
    // Check rate limiting (example config for API endpoints)
    if (endpoint.startsWith('/api/')) {
      const isLimited = checkRateLimit(endpoint, { interval: 60000, maxRequests: 50 });
      if (isLimited) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }
    
    // Offline check
    if (!navigator.onLine) {
      // Try to return from cache for offline requests
      const cachedResponse = getFromCache<T>(cacheKey, Infinity); // No expiration when offline
      if (cachedResponse) {
        return {
          data: cachedResponse.data,
          error: null,
          loading: false,
          fromCache: true,
          offline: true
        };
      }
      
      throw new Error('You are currently offline. Please check your internet connection.');
    }
    
    // Check cache for GET requests
    if ((method === 'GET' || !method) && !cacheOptions?.bypassCache) {
      const cachedResponse = getFromCache<T>(cacheKey, cacheOptions?.ttl);
      
      // Return cached response immediately if available and using staleWhileRevalidate
      if (cachedResponse && cacheOptions?.useStaleWhileRevalidate) {
        // Revalidate in background
        setTimeout(() => {
          apiRequest(endpoint, {
            ...options,
            cacheOptions: {
              ...(options.cacheOptions || {}),
              bypassCache: true // Force bypass cache for revalidation
            }
          });
        }, 0);
        
        // Return cached data
        return {
          data: cachedResponse.data,
          error: null,
          loading: false,
          fromCache: true
        };
      }
      
      // Return cached response without revalidation
      if (cachedResponse) {
        return {
          data: cachedResponse.data,
          error: null,
          loading: false,
          fromCache: true
        };
      }
    }
    
    // Determine which API client to use based on endpoint
    if (endpoint.startsWith('/api/supabase/')) {
      // Handle Supabase-specific API requests
      return await handleSupabaseRequest(endpoint, mergedOptions);
    } else {
      // Make a regular fetch request for other API endpoints
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      };
      
      const response = await fetch(endpoint, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache successful GET responses
      if ((method === 'GET' || !method) && response.ok) {
        const etag = response.headers.get('ETag') || undefined;
        setInCache(cacheKey, data, etag);
      }
      
      return {
        data,
        error: null,
        loading: false,
        fromCache: false,
        status: response.status,
        statusText: response.statusText
      };
    }
  } catch (error) {
    // Handle retry logic for transient errors
    if (retry && retry.count > 0 && navigator.onLine) {
      return retryRequest<T>(endpoint, mergedOptions, retry.count);
    }
    
    // Log error to monitoring system
    errorMonitoring.captureError(
      error instanceof Error ? error : new Error(String(error)),
      undefined,
      ErrorCategory.API,
      {
        endpoint,
        method,
        body: typeof body === 'object' ? JSON.stringify(body) : body,
        offline: !navigator.onLine
      }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      loading: false,
      fromCache: false,
      offline: !navigator.onLine
    };
  }
}

/**
 * Handle Supabase-specific API requests
 */
async function handleSupabaseRequest<T>(endpoint: string, options: ApiRequestOptions): Promise<ApiResponse<T>> {
  const { method = 'GET', body } = options;
  const path = endpoint.replace('/api/supabase/', '');
  
  try {
    let data = null;
    
    switch (path) {
      case 'auth/user':
        data = await supabase.auth.getUser();
        break;
      case 'auth/signout':
        data = await supabase.auth.signOut();
        break;
      default:
        // Extract table and id from path
        const [table, id] = path.split('/');
        
        // Perform database operations based on method and path
        switch (method) {
          case 'GET':
            const query = id 
              ? supabase.from(table).select('*').eq('id', id)
              : supabase.from(table).select('*');
            data = await query;
            break;
          case 'POST':
            data = await supabase.from(table).insert(body).select();
            break;
          case 'PUT':
            data = await supabase.from(table).update(body).eq('id', id).select();
            break;
          case 'DELETE':
            data = await supabase.from(table).delete().eq('id', id);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
    }
    
    if (data.error) {
      throw new Error(`Supabase error: ${data.error.message}`);
    }
    
    return {
      data: data.data as T,
      error: null,
      loading: false,
      fromCache: false
    };
  } catch (error) {
    errorMonitoring.captureError(
      error instanceof Error ? error : new Error(String(error)),
      undefined,
      ErrorCategory.API,
      { endpoint, method }
    );
    
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      loading: false,
      fromCache: false
    };
  }
}

/**
 * Clear the entire cache or a specific cache entry
 */
export function clearCache(key?: string): void {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number, keys: string[] } {
  return {
    size: Object.keys(cache).length,
    keys: Object.keys(cache)
  };
}

/**
 * Check if a value exists in cache
 */
export function isInCache(key: string): boolean {
  return !!cache[key];
}

export default {
  request: apiRequest,
  clearCache,
  getCacheStats,
  isInCache
};
