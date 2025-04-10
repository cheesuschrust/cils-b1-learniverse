
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef, 
  useContext, 
  Component, 
  createContext, 
  forwardRef 
} from 'react';

// Re-export all React hooks and components
export {
  React as default,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  Component,
  createContext,
  forwardRef
};

// Export React types
export type ReactNode = React.ReactNode;
export type ErrorInfo = React.ErrorInfo;
export type FC<P = {}> = React.FC<P>;
export type ComponentType<P = {}> = React.ComponentType<P>;
export type FormEvent<T = Element> = React.FormEvent<T>;
export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
export type MouseEvent<T = Element> = React.MouseEvent<T>;
export type CSSProperties = React.CSSProperties;
export type ReactElement = React.ReactElement;
export type PropsWithChildren<P = {}> = React.PropsWithChildren<P>;
