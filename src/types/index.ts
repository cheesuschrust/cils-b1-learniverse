
// Root type index file
// Re-export all types with namespacing to prevent ambiguities

import * as AppTypes from './app-types';
import * as ItalianTypes from './italian-types';
import * as VariantTypes from './variant-fixes';
import * as InterfaceTypes from './interface-fixes';
import * as TypeDefinitions from './type-definitions';

// Export all types through namespaces to prevent conflicts
export { AppTypes, ItalianTypes, VariantTypes, InterfaceTypes, TypeDefinitions };

// Export specific commonly used types directly
// Italian types
export type { 
  ItalianLevel, 
  ItalianTestSection, 
  QuestionGenerationParams as ItalianQuestionParams,
  AIGeneratedQuestion,
  AIGenerationResult as ItalianGenerationResult,
  CILSExamType,
  UserProfile as ItalianUserProfile
} from './italian-types';

// App types
export type {
  DifficultyLevel,
  ContentType,
  ButtonVariant,
  AIQuestion,
  EnhancedErrorBoundaryProps,
  AIContentProcessorProps,
  ProcessContentOptions,
  ConfidenceIndicatorProps,
  LevelBadgeProps
} from './app-types';

export type {
  QuestionGenerationParams,
  AIGenerationResult,
  UserProfile,
  AIUtilsContextType
} from './app-types';

// Interface fixes
export type {
  SpeakableWordProps,
  Flashcard,
  FlashcardComponentProps,
  ReviewSchedule,
  ReviewPerformance,
  User,
  AISettings
} from './interface-fixes';

// Variant fixes
export type {
  ExtendedAlertVariant,
  ExtendedButtonVariant,
  ExtendedSelectVariant,
  ExtendedInputVariant,
  ExtendedThemeVariant
} from './variant-fixes';

// Helper functions
export { normalizeFlashcard, calculateReviewPerformance } from './interface-fixes';
