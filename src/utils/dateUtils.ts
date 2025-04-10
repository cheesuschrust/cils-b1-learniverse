
/**
 * Safely convert a value to a Date object, handling null/undefined values
 * @param value Date string, number, Date object or null/undefined
 * @returns A valid Date object or null if input is invalid
 */
export function safeParseDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Ensures a value is a valid Date object
 * Uses current date as fallback for invalid values
 */
export function ensureDate(value: any): Date {
  if (value === null || value === undefined) {
    return new Date();
  }
  
  const date = new Date(value);
  return isNaN(date.getTime()) ? new Date() : date;
}
