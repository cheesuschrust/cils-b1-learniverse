
import { useCallback, useEffect, useState } from 'react';
import { apiRequest, ApiRequestOptions, ApiResponse } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { errorMonitoring } from '@/utils/errorMonitoring';

interface UseApiOptions<T> extends ApiRequestOptions {
  shouldFetch?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  cacheKey?: string;
  cacheTtl?: number; // Time to live in milliseconds
}

export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
    fromCache: false
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    shouldFetch = true,
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    cacheKey,
    cacheTtl = 5 * 60 * 1000, // 5 minutes default
    ...apiOptions
  } = options;
  
  const fetchData = useCallback(
    async (overrideOptions?: ApiRequestOptions) => {
      // Check if we have a cached response
      if (cacheKey) {
        try {
          const cachedResponse = localStorage.getItem(`api_cache_${cacheKey}`);
          if (cachedResponse) {
            const { data, timestamp } = JSON.parse(cachedResponse);
            const isExpired = Date.now() - timestamp > cacheTtl;
            
            if (!isExpired) {
              setResponse({
                data,
                error: null,
                loading: false,
                fromCache: true
              });
              
              if (onSuccess) onSuccess(data);
              
              // If we're offline, don't try to fetch
              if (!navigator.onLine) return { data, error: null };
            }
          }
        } catch (error) {
          console.warn('Error reading from cache:', error);
          // Continue with the fetch if cache fails
        }
      }
      
      setResponse(prev => ({ ...prev, loading: true }));
      
      try {
        // Add authorization header for authenticated endpoints
        const authHeaders = user ? { 
          Authorization: `Bearer ${user.token}` 
        } : {};
        
        const result = await apiRequest<T>(endpoint, {
          ...apiOptions,
          ...overrideOptions,
          headers: {
            ...authHeaders,
            ...apiOptions.headers,
            ...(overrideOptions?.headers || {})
          }
        });
        
        setResponse(result);
        
        if (result.error) {
          if (onError) onError(result.error);
          
          if (showErrorToast) {
            toast({
              title: "Error",
              description: result.error.message,
              variant: "destructive"
            });
          }
          
          // Log error to monitoring service
          errorMonitoring.captureError(result.error, {
            context: `API Request: ${endpoint}`,
            endpoint,
            requestBody: apiOptions.body ? JSON.stringify(apiOptions.body) : undefined
          });
          
          return result;
        }
        
        // Cache successful responses if cacheKey is provided
        if (cacheKey && result.data) {
          try {
            localStorage.setItem(`api_cache_${cacheKey}`, JSON.stringify({
              data: result.data,
              timestamp: Date.now()
            }));
          } catch (error) {
            console.warn('Error writing to cache:', error);
            // Continue even if caching fails
          }
        }
        
        if (result.data) {
          if (onSuccess) onSuccess(result.data);
          
          if (showSuccessToast && successMessage) {
            toast({
              title: "Success",
              description: successMessage,
              variant: "default"
            });
          }
        }
        
        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        
        setResponse({
          data: null,
          error: errorObj,
          loading: false,
          fromCache: false
        });
        
        if (onError) onError(errorObj);
        
        if (showErrorToast) {
          toast({
            title: "Error",
            description: errorObj.message || "An unexpected error occurred",
            variant: "destructive"
          });
        }
        
        // Log error to monitoring service
        errorMonitoring.captureError(errorObj, {
          context: `API Request: ${endpoint}`,
          endpoint,
          requestBody: apiOptions.body ? JSON.stringify(apiOptions.body) : undefined
        });
        
        return {
          data: null,
          error: errorObj,
          loading: false,
          fromCache: false
        };
      }
    },
    [endpoint, apiOptions, user, onSuccess, onError, showErrorToast, showSuccessToast, 
     successMessage, toast, cacheKey, cacheTtl]
  );
  
  // Fetch data on mount if shouldFetch is true
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch, fetchData]);
  
  // Utility function to clear cache for this endpoint
  const clearCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(`api_cache_${cacheKey}`);
    }
  }, [cacheKey]);
  
  // Re-fetch when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (shouldFetch) {
        fetchData();
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [shouldFetch, fetchData]);
  
  return {
    ...response,
    refetch: fetchData,
    clearCache
  };
}
