
// This file is now deprecated, use AuthContext.tsx instead
import { AuthProvider, useAuth } from './AuthContext';

// Re-export for backward compatibility
export { AuthProvider, useAuth };

console.warn(
  'Warning: This file (EnhancedAuthContext.tsx) is deprecated. ' +
  'Import from "src/contexts/AuthContext.tsx" instead.'
);
