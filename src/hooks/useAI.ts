
// Re-export the simplified AI hook
import useAISimplified from './useAISimplified';
import { normalizeFlashcard, convertLegacyUser } from '@/utils/typeCompatibility';

// Export the hook with the same interface
export const useAI = useAISimplified;
export { normalizeFlashcard, convertLegacyUser };
export default useAI;
