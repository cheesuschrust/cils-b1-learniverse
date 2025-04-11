
// Create proper typed exports for React
import React from 'react';

// Re-export everything from React
const {
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
  Suspense
} = React;

// Also export types as needed
type ReactNode = React.ReactNode;
type ErrorInfo = React.ErrorInfo;

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
