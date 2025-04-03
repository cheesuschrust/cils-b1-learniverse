
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to synchronize state with URL query parameters,
 * enabling deep linking and state persistence across sessions
 */
export function useUrlState<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    shallow?: boolean; // Whether changes should be added to browser history
  } = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { 
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    shallow = false
  } = options;
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial value from URL or default
  const getInitialValue = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const urlValue = params.get(key);
    
    if (urlValue === null) {
      return defaultValue;
    }
    
    try {
      return deserialize(urlValue);
    } catch (error) {
      console.warn(`Error deserializing URL parameter "${key}":`, error);
      return defaultValue;
    }
  }, [key, location.search, defaultValue, deserialize]);
  
  const [state, setState] = useState<T>(getInitialValue());
  
  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentValue = params.get(key);
    
    let serialized: string;
    try {
      serialized = serialize(state);
    } catch (error) {
      console.error(`Error serializing state for URL parameter "${key}":`, error);
      return;
    }
    
    // Only update if value changed
    if (currentValue !== serialized) {
      // Update URL parameters
      const newParams = new URLSearchParams(location.search);
      
      if (serialized === serialize(defaultValue)) {
        // Remove param if it's the default value
        newParams.delete(key);
      } else {
        // Update param
        newParams.set(key, serialized);
      }
      
      // Update URL without full page reload
      navigate(
        `${location.pathname}${newParams.toString() ? `?${newParams}` : ''}`, 
        { replace: shallow }
      );
    }
  }, [state, key, serialize, navigate, location.pathname, location.search, shallow, defaultValue]);
  
  // Update state when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlValue = params.get(key);
    
    // If URL param exists, update state
    if (urlValue !== null) {
      try {
        setState(deserialize(urlValue));
      } catch (error) {
        console.warn(`Error deserializing URL parameter "${key}":`, error);
      }
    } else {
      // If URL param doesn't exist, reset to default
      setState(defaultValue);
    }
  }, [key, location.search, deserialize, defaultValue]);
  
  // Return state and setState function
  return [state, setState];
}

export default useUrlState;
