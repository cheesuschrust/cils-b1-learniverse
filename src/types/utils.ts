
/**
 * Takes an object with snake_case keys and returns a new object
 * with camelCase keys
 */
export function normalizeFields<T extends Record<string, any>>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== 'object') return obj as T;
  
  const normalizedObj: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const camelKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
      
      if (Array.isArray(value)) {
        normalizedObj[camelKey] = value.map(item => {
          if (item && typeof item === 'object') {
            return normalizeFields(item);
          }
          return item;
        });
      } else if (value && typeof value === 'object' && !(value instanceof Date)) {
        normalizedObj[camelKey] = normalizeFields(value);
      } else {
        normalizedObj[camelKey] = value;
      }
    }
  }
  
  return normalizedObj as T;
}
