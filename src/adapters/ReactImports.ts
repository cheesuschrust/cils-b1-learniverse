
// Re-export React imports to fix TypeScript errors
import * as ReactModule from 'react';

// Create proper typed exports
export const useState = ReactModule.useState;
export const useEffect = ReactModule.useEffect;
export const useCallback = ReactModule.useCallback;
export const Component = ReactModule.Component;
export const ErrorInfo = ReactModule.ErrorInfo;
export type ReactNode = ReactModule.ReactNode;

// Export default React as a fallback
export default ReactModule;
