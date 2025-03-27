
/**
 * Utilities for testing components and functionality
 */
import { render, RenderResult } from '@testing-library/react';
import React, { FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Test wrapper that includes all providers
interface TestWrapperProps {
  children: React.ReactNode;
}

export const TestWrapper: FC<TestWrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <ErrorBoundary>
          <AIUtilsProvider>
            <GamificationProvider>
              {children}
            </GamificationProvider>
          </AIUtilsProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Custom render that wraps with all providers
export function renderWithProviders(
  ui: ReactElement,
  options = {}
): RenderResult {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Mock for browser APIs that might not be available in test environment
export const setupBrowserMocks = () => {
  // Mock local storage
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
  });
  
  // Mock speech synthesis
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: jest.fn(),
      cancel: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      getVoices: jest.fn(() => []),
      onvoiceschanged: null
    }
  });
  
  // Mock media devices
  Object.defineProperty(window.navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({}),
      enumerateDevices: jest.fn().mockResolvedValue([])
    }
  });
};

// Helper to wait for component to update
export const wait = (ms: number = 0): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Helper to mock API responses
export const mockApiResponse = <T>(data: T, delay = 100): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export default {
  renderWithProviders,
  setupBrowserMocks,
  wait,
  mockApiResponse,
  TestWrapper
};
