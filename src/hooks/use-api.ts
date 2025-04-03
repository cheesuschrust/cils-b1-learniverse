
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
    ...apiOptions
  } = options;
  
  const fetchData = useCallback(
    async (overrideOptions?: ApiRequestOptions) => {
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
          
          return result;
        }
        
        if (result.data && onSuccess) {
          onSuccess(result.data);
          
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
        const err = error instanceof Error ? error : new Error(String(error));
        
        setResponse({
          data: null,
          error: err,
          loading: false,
          fromCache: false
        });
        
        if (onError) onError(err);
        
        if (showErrorToast) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive"
          });
        }
        
        errorMonitoring.captureError(err, undefined, 'api', { endpoint });
        
        return {
          data: null,
          error: err,
          loading: false,
          fromCache: false
        };
      }
    },
    [endpoint, apiOptions, user, onSuccess, onError, showErrorToast, showSuccessToast, successMessage, toast]
  );
  
  // Function to manually trigger fetch with optional different options
  const refetch = useCallback(
    (overrideOptions?: ApiRequestOptions) => {
      return fetchData(overrideOptions);
    },
    [fetchData]
  );
  
  // Initial fetch effect
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch, fetchData]);
  
  return {
    ...response,
    refetch,
    isLoading: response.loading,
    isError: !!response.error,
    isOffline: !navigator.onLine
  };
}

export function useCreate<T = any, D = any>(
  endpoint: string,
  options: Omit<UseApiOptions<T>, 'method'> = {}
) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const create = useCallback(
    async (data: D) => {
      setIsCreating(true);
      
      try {
        const result = await apiRequest<T>(endpoint, {
          method: 'POST',
          body: data,
          ...options
        });
        
        if (result.error) {
          if (options.onError) options.onError(result.error);
          
          if (options.showErrorToast !== false) {
            toast({
              title: "Error",
              description: result.error.message,
              variant: "destructive"
            });
          }
          
          setIsCreating(false);
          return result;
        }
        
        if (result.data && options.onSuccess) {
          options.onSuccess(result.data);
        }
        
        if (options.showSuccessToast && options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
            variant: "default"
          });
        }
        
        setIsCreating(false);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        if (options.onError) options.onError(err);
        
        if (options.showErrorToast !== false) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive"
          });
        }
        
        setIsCreating(false);
        return {
          data: null,
          error: err,
          loading: false,
          fromCache: false
        };
      }
    },
    [endpoint, options, toast]
  );
  
  return { create, isCreating };
}

export function useUpdate<T = any, D = any>(
  endpoint: string,
  options: Omit<UseApiOptions<T>, 'method'> = {}
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const update = useCallback(
    async (id: string, data: D) => {
      setIsUpdating(true);
      
      try {
        const updateEndpoint = `${endpoint}/${id}`;
        const result = await apiRequest<T>(updateEndpoint, {
          method: 'PUT',
          body: data,
          ...options
        });
        
        if (result.error) {
          if (options.onError) options.onError(result.error);
          
          if (options.showErrorToast !== false) {
            toast({
              title: "Error",
              description: result.error.message,
              variant: "destructive"
            });
          }
          
          setIsUpdating(false);
          return result;
        }
        
        if (result.data && options.onSuccess) {
          options.onSuccess(result.data);
        }
        
        if (options.showSuccessToast && options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
            variant: "default"
          });
        }
        
        setIsUpdating(false);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        if (options.onError) options.onError(err);
        
        if (options.showErrorToast !== false) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive"
          });
        }
        
        setIsUpdating(false);
        return {
          data: null,
          error: err,
          loading: false,
          fromCache: false
        };
      }
    },
    [endpoint, options, toast]
  );
  
  return { update, isUpdating };
}

export function useDelete<T = any>(
  endpoint: string,
  options: Omit<UseApiOptions<T>, 'method'> = {}
) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const remove = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      
      try {
        const deleteEndpoint = `${endpoint}/${id}`;
        const result = await apiRequest<T>(deleteEndpoint, {
          method: 'DELETE',
          ...options
        });
        
        if (result.error) {
          if (options.onError) options.onError(result.error);
          
          if (options.showErrorToast !== false) {
            toast({
              title: "Error",
              description: result.error.message,
              variant: "destructive"
            });
          }
          
          setIsDeleting(false);
          return result;
        }
        
        if (result.data && options.onSuccess) {
          options.onSuccess(result.data);
        }
        
        if (options.showSuccessToast && options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
            variant: "default"
          });
        }
        
        setIsDeleting(false);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        if (options.onError) options.onError(err);
        
        if (options.showErrorToast !== false) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive"
          });
        }
        
        setIsDeleting(false);
        return {
          data: null,
          error: err,
          loading: false,
          fromCache: false
        };
      }
    },
    [endpoint, options, toast]
  );
  
  return { remove, isDeleting };
}

export default useApi;
