
import { Flashcard } from '@/types/interface-fixes';

// Utility function to normalize flashcard data
export function normalizeFlashcard(data: any): Flashcard {
  return {
    id: data.id || Math.random().toString(36).substring(2, 15),
    front: data.front || data.question || '',
    back: data.back || data.answer || '',
    hint: data.hint || null,
    tags: data.tags || [],
    difficulty: data.difficulty || 1,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
}

// Utility function for safely handling unknown types
export function safelyUnwrapUnknown<T>(value: unknown, defaultValue: T): T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  try {
    return value as T;
  } catch (err) {
    console.error('Error unwrapping unknown value:', err);
    return defaultValue;
  }
}

// Type guard for checking if a value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard for checking if a value is an array
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// Utility for converting form data to typed objects
export function convertFormData<T>(data: Record<string, any>, defaultValues: T): T {
  const result = { ...defaultValues };
  
  for (const key in data) {
    if (key in defaultValues) {
      // Type assertion is safe here because we check that the key exists in defaultValues
      (result as any)[key] = data[key];
    }
  }
  
  return result;
}
