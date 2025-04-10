
/**
 * Normalizes field names from snake_case to camelCase
 */
export function normalizeFields<T extends Record<string, any>>(obj: Record<string, any>): T {
  if (!obj) return {} as T;
  
  return Object.entries(obj).reduce((normalized, [key, value]) => {
    // Convert snake_case to camelCase
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Handle nested objects and arrays recursively
    let normalizedValue = value;
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        normalizedValue = value.map(item => 
          typeof item === 'object' && item !== null
            ? normalizeFields(item)
            : item
        );
      } else {
        normalizedValue = normalizeFields(value);
      }
    }
    
    return {
      ...normalized,
      [camelCaseKey]: normalizedValue
    };
  }, {} as T);
}

/**
 * Converts camelCase fields to snake_case
 */
export function toSnakeCase<T extends Record<string, any>>(obj: Record<string, any>): T {
  if (!obj) return {} as T;
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    // Convert camelCase to snake_case
    const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Handle nested objects and arrays recursively
    let snakeCaseValue = value;
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        snakeCaseValue = value.map(item => 
          typeof item === 'object' && item !== null
            ? toSnakeCase(item)
            : item
        );
      } else {
        snakeCaseValue = toSnakeCase(value);
      }
    }
    
    return {
      ...result,
      [snakeCaseKey]: snakeCaseValue
    };
  }, {} as T);
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | number, format: string = 'default'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString();
    case 'datetime':
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    case 'relative':
      return getRelativeTimeString(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Returns a relative time string like "5 minutes ago" or "in 3 days"
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (Math.abs(diffInSecs) < 60) {
    return rtf.format(diffInSecs, 'second');
  } else if (Math.abs(diffInMins) < 60) {
    return rtf.format(diffInMins, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  } else {
    // Fall back to regular date format for dates more than a month away
    return date.toLocaleDateString();
  }
}

export default {
  normalizeFields,
  toSnakeCase,
  formatDate
};
