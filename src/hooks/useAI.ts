
// Re-export the simplified AI hook
import useAISimplified from './useAISimplified';
import { AIOptions } from '@/types/ai';
import { normalizeFlashcard } from '@/types/flashcard-types';
import { convertLegacyUser } from '@/types/user-types';

// Export the hook with the same interface
export const useAI = useAISimplified;
export type { AIOptions };
export { normalizeFlashcard, convertLegacyUser };
export default useAI;
