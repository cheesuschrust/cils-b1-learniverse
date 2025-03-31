
# TypeScript Types Documentation

This document provides an overview of the key types and interfaces used throughout the project.

## Core Types

### User Types

- `User`: The core user model containing authentication and profile information
- `UserRole`: Role-based access control (`'user' | 'admin' | 'teacher' | 'moderator' | 'editor'`)
- `UserPreferences`: User preferences including theme, notifications, and language settings
- `UserMetrics`: User performance metrics including questions answered and accuracy

### Content Types

- `ContentType`: Types of educational content (`'flashcards' | 'multiple-choice' | 'listening' | 'writing' | 'speaking' | 'pdf' | 'unknown'`)
- `Flashcard`: Structure for flashcard content with front, back, and metadata
- `Question`: Structure for quiz questions and related metadata

### AI Types

- `AISettings`: Configuration options for AI processing
- `AIModel`: Supported AI models (`'small' | 'medium' | 'large' | specific model names`)
- `AIPreference`: Level of AI assistance (`'minimal' | 'balanced' | 'extensive'`)
- `AIStatus`: Status of AI operations (`'idle' | 'loading' | 'generating' | 'error' | 'ready'`)

### UI Types

- `ExtendedAlertVariant`: Alert variants (`'default' | 'destructive' | 'outline' | 'secondary' | 'warning' | 'success' | 'primary' | 'info'`)
- `ExtendedButtonVariant`: Button variants including additional options like `'success'` and `'warning'`
- `ThemeOption`: Theme options (`'light' | 'dark' | 'system'`)

## Context Types

- `AuthContextType`: Authentication context with user state and auth functions
- `AIUtilsContextType`: Utilities for AI content processing and generation
- `UserPreferencesContextType`: User preferences management

## Component Props

- `ErrorBoundaryProps`: Props for error boundary components
- `ProcessContentOptions`: Options for AI content processing
- `ConfidenceIndicatorProps`: Props for displaying AI confidence scores
- `FlashcardComponentProps`: Props for flashcard components

## Type Utilities

- `normalizeUser`: Converts between different user type formats
- `normalizeFields`: Handles snake_case to camelCase conversions
- `normalizeLanguage`: Normalizes language identifiers
- `normalizeAIModel`: Standardizes AI model references

## Best Practices

1. **Import Types Consistently**: Always import types from `@/types` namespace
   ```typescript
   import { User, ContentType } from '@/types';
   ```

2. **Use Type Annotations**: Explicitly type function parameters and return values
   ```typescript
   function processContent(text: string, options?: ProcessContentOptions): Promise<string> {
     // Implementation
   }
   ```

3. **Component Props Typing**: Always define prop interfaces for React components
   ```typescript
   interface ButtonProps {
     variant?: ExtendedButtonVariant;
     onClick?: () => void;
     children: React.ReactNode;
   }
   ```

4. **Use Type Guards**: Create type guards for runtime type checking
   ```typescript
   function isUser(obj: any): obj is User {
     return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
   }
   ```

5. **Avoid `any`**: Use specific types or generics instead of `any`

6. **Use Type Utilities**: Leverage TypeScript utility types like `Partial<T>`, `Omit<T, K>`, etc.

7. **Document Complex Types**: Add JSDoc comments to complex types

## Type Structure

The project's types are organized into several files:

- `types/index.ts` - Core type exports 
- `types/user.ts` - User-related types
- `types/ai.ts` - AI-related types
- `types/flashcard.ts` - Flashcard-related types
- `types/variant-fixes.ts` - UI variant types and fixes
- `types/type-compatibility.ts` - Type compatibility helpers

## Type Resolution Order

When resolving types, the system uses the following priority:

1. Explicitly imported types
2. Types from `@/types`
3. Types from component prop definitions
4. Library and React built-in types

## Extending Types

When extending existing types, use the TypeScript extension pattern:

```typescript
interface EnhancedUser extends User {
  premiumFeatures: string[];
  subscriptionDetails: {
    plan: string;
    expiresAt: Date;
  };
}
```
