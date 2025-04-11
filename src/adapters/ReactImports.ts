
// Create proper typed exports for React
import React from 'react';

// Re-export everything from React with proper typing
export const {
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
export type ReactNode = React.ReactNode;
export type ErrorInfo = React.ErrorInfo;
export type CSSProperties = React.CSSProperties;
export type SyntheticEvent = React.SyntheticEvent;
export type FormEvent = React.FormEvent;
export type ReactElement = React.ReactElement;
export type FC<P = {}> = React.FC<P>;
export type ComponentProps<T> = React.ComponentProps<T>;
export type ComponentType<P = {}> = React.ComponentType<P>;
export type JSXElementConstructor<P> = React.JSXElementConstructor<P>;
export type PropsWithChildren<P = {}> = React.PropsWithChildren<P>;

// Default export for direct React imports
export default React;
