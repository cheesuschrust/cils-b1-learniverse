
// Re-export the simplified AI hook
import useAISimplified from './useAISimplified';
import { AIOptions } from '@/types/core';
import { normalizeFlashcard, convertLegacyUser } from '@/types/core';

// Export the hook with the same interface
export const useAI = useAISimplified;
export type { AIOptions };
export { normalizeFlashcard, convertLegacyUser };
export default useAI;
