
import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import { User } from './user';
import { ChatSession } from './chatbot';
import { FlashcardSet } from './flashcard';

// Generic hook return types
export type UseToggleReturn = [boolean, () => void, (value: boolean) => void];
export type UseCounterReturn = [number, () => void, () => void, (value: number) => void];
export type UseDisclosureReturn = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

// Specific hook types
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export interface UseDocumentsReturn {
  documents: DocumentMeta[];
  isLoading: boolean;
  error: Error | null;
  uploadDocument: (file: File) => Promise<string>;
  getDocument: (id: string) => DocumentMeta | undefined;
  refreshDocuments: () => void;
}

export interface UseChatReturn {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  startNewSession: () => void;
}

export interface UseFlashcardsReturn {
  flashcardSets: FlashcardSet[];
  currentSet: FlashcardSet | null;
  isLoading: boolean;
  error: Error | null;
  loadSet: (id: string) => Promise<void>;
  createSet: (data: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSet: (id: string, data: Partial<FlashcardSet>) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, isTouched: boolean) => void;
  resetForm: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  remove: () => void;
}

export interface UseMediaQueryReturn {
  matches: boolean;
  media: string;
}

export interface UseOutsideClickReturn {
  ref: MutableRefObject<HTMLElement | null>;
  isOutsideClick: boolean;
  reset: () => void;
}

export interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => void;
}

export interface UseDebouncedValueReturn<T> {
  value: T;
  debouncedValue: T;
  isDebouncing: boolean;
  cancelDebounce: () => void;
}

export interface UseThrottledValueReturn<T> {
  value: T;
  throttledValue: T;
  isThrottling: boolean;
}
