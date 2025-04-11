
// Re-export React imports to fix TypeScript errors
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef, 
  useContext, 
  Component, 
  createContext, 
  forwardRef, 
  lazy, 
  Suspense, 
  type ReactNode,
  type ErrorInfo
} from 'react';

// Create proper typed exports
export { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef, 
  useContext, 
  Component, 
  createContext, 
  forwardRef, 
  lazy, 
  Suspense, 
  type ReactNode,
  type ErrorInfo
};

// Export default React as a fallback
export default React;
