
// Re-export the simplified AI hook
import useAISimplified from './useAISimplified';
import { AIOptions, normalizeFlashcard, convertLegacyUser } from '@/types/core';

// Export the hook with the same interface
export const useAI = useAISimplified;
export { normalizeFlashcard, convertLegacyUser, AIOptions };
export default useAI;
