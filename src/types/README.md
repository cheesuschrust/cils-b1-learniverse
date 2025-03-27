
# Type System Documentation

This directory contains all TypeScript types and interfaces used throughout the application.
The types are organized into different files based on their domain and use cases.

## Directory Structure

- `index.d.ts` - Main entry point that exports all common types
- `service.d.ts` - Types related to services and API interactions
- `component.d.ts` - Types for component props and state
- `user.d.ts` - User-related types
- `document.d.ts` - Document-related types
- `ai.d.ts` - AI and machine learning related types
- `chatbot.d.ts` - Chatbot and conversational UI types
- `notification.d.ts` - Notification system types
- `flashcard.d.ts` - Flashcard and learning content types
- `question.d.ts` - Question and quiz types
- `gamification.d.ts` - Gamification and achievement types
- `analytics.d.ts` - Analytics and reporting types
- `interface-fixes.ts` - Compatibility fixes for third-party libraries

## Best Practices

1. **Always use proper typing**: Avoid using `any` or `unknown` types when possible.
2. **Use generics for reusable components**: Generic types help create flexible but type-safe components.
3. **Define discriminated unions**: Use discriminated unions (with a type property) for complex state.
4. **Nullable vs Optional**: Use `T | null` when a value can be explicitly null, and `T | undefined` (or optional `T?`) when a value might not be provided.
5. **Document complex types**: Add JSDoc comments to explain complex types.
6. **Use mapped types and utility types**: Leverage TypeScript's utility types like `Partial<T>`, `Required<T>`, `Pick<T>`, etc.

## Examples

### Defining a component with proper prop typing:

```tsx
// Component props with proper typing
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

// Component with prop types
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  isLoading = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  // Component implementation
};
```

### Using discriminated unions for state:

```tsx
// Discriminated union for API request state
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Using the state in a component
const [state, setState] = useState<RequestState<User>>({ status: 'idle' });

// Type-safe rendering based on state
const renderContent = () => {
  switch (state.status) {
    case 'idle':
      return <p>Ready to load data</p>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserProfile user={state.data} />;
    case 'error':
      return <ErrorMessage message={state.error.message} />;
  }
};
```
