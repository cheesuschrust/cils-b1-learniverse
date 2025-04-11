
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

// Common form field properties
export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Input field props
export interface InputFieldProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  autoComplete?: string;
}

// Select field props
export interface SelectFieldProps extends FormFieldProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// Checkbox field props
export interface CheckboxFieldProps extends FormFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// Textarea field props
export interface TextareaFieldProps extends FormFieldProps {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

// Radio group props
export interface RadioGroupProps extends FormFieldProps {
  options: Array<{ value: string; label: string }>;
  orientation?: 'horizontal' | 'vertical';
}

// Helper function to create a form schema builder
export const createFormSchema = <T extends Record<string, any>>(schema: z.ZodObject<any>) => {
  return {
    schema,
    formProps: (form: UseFormReturn<T>): { form: UseFormReturn<T> } => ({
      form
    })
  };
};

// Helper function to normalize form errors
export const getFormErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'An error occurred';
};
