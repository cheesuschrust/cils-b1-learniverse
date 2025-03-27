
/**
 * Helper utilities for testing and mocking
 */

// Creates a mock function with typed return value
export function createMockFunction<T extends (...args: any[]) => any>(
  returnValue?: ReturnType<T>
): jest.MockedFunction<T> {
  return jest.fn(() => returnValue) as jest.MockedFunction<T>;
}

// Creates a mock object with all properties mocked as functions
export function createMockObject<T extends object>(overrides: Partial<T> = {}): jest.Mocked<T> {
  const mockObj = {} as jest.Mocked<T>;
  
  // Add mock functions for all methods
  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      mockObj[key] = overrides[key] as any;
    }
  }
  
  return mockObj;
}

// Creates a partial mock where only specified properties are mocked
export function createPartialMock<T extends object>(
  implementations: Partial<{ [K in keyof T]: T[K] }>
): Partial<T> {
  return implementations;
}

// Helper to wait for promises to resolve in tests
export function waitForPromises(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

// Helper to mock localStorage
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    key: jest.fn((index: number) => {
      return Object.keys(store)[index] || null;
    }),
    length: Object.keys(store).length
  };
}

// Helper to mock fetch
export function mockFetch(response: any, ok = true, status = 200) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: new Headers(),
      redirected: false,
      statusText: ok ? 'OK' : 'Error',
      type: 'basic',
      url: 'https://test.com/api',
      clone: function() { return this; }
    })
  );
}

export default {
  createMockFunction,
  createMockObject,
  createPartialMock,
  waitForPromises,
  mockLocalStorage,
  mockFetch
};
