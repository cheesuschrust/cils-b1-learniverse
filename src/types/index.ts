
// Core type index file
// Re-export all types with namespacing to prevent ambiguities

import * as AppTypes from './app-types';
import * as ItalianTypes from './italian-types';
import * as VariantTypes from './variant-fixes';
import * as InterfaceTypes from './interface-fixes';
import * as TypeDefinitions from './type-definitions';
import * as CoreTypes from './core-types';
import * as AITypes from './ai';

// Export all types through namespaces to prevent conflicts
export { AppTypes, ItalianTypes, VariantTypes, InterfaceTypes, TypeDefinitions, CoreTypes, AITypes };

// Export specific commonly used types directly
// Italian types
export type { 
  ItalianLevel, 
  ItalianTestSection, 
  ItalianQuestionGenerationParams,
  AIGeneratedQuestion,
  AIGenerationResult,
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
  LevelBadgeProps,
  AIUtilsContextType,
  QuestionGenerationParams,
  AIGenerationResult as AppAIGenerationResult,
  UserProfile
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
  ExtendedThemeVariant,
  ContentType as VariantContentType
} from './variant-fixes';

// Core types from unified module
export {
  normalizeFlashcard,
  calculateReviewPerformance,
  isValidDate,
  normalizeFields
} from './core-types';

// AI types
export type {
  AIModel,
  AIProvider,
  AIServiceOptions,
  AIPreference,
  UseAIReturn,
  AIService,
  AIStatus,
  AIOptions,
  AIFeedbackSettings
} from './ai';

// License types
export type {
  License,
  LicenseType,
  LicenseStatus,
  RenewalStatus,
  LicenseUserAssignment,
  LicenseFeature,
  LicenseInvoice
} from './License';
