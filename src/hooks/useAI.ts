
// Re-export the simplified AI hook
import useAISimplified from './useAISimplified';
import { AIServiceOptions, UseAIReturn } from '@/types/ai';
import { normalizeFlashcard } from '@/types/interface-fixes';
import { convertLegacyUser } from '@/types/user-types';

// Export the hook with the same interface
export const useAI = useAISimplified;
export type { AIServiceOptions, UseAIReturn };
export { normalizeFlashcard, convertLegacyUser };
export default useAI;
