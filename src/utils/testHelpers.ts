
/**
 * Wait for any pending promises
 */
export const flushPromises = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock event creation
 */
export const createMockEvent = (
  overrides: Partial<Event | React.SyntheticEvent> = {}
): Partial<Event | React.SyntheticEvent> => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  ...overrides
});

/**
 * Regular expression patterns for validation
 */
export export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

/**
 * Calculate review performance for spaced repetition
 */
export const calculateReviewPerformance = (
  correctness: number,
  previousInterval: number = 1
): number => {
  // Simple algorithm: if correctness is high, increase interval more
  const baseMultiplier = 1 + correctness;
  return Math.round(previousInterval * baseMultiplier);
};

/**
 * Helper function to create a UUID for testing
 */
export const createUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Helper function to generate random numbers for testing
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Helper function to generate random text for testing
 */
export const getRandomText = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Helper function to wait for a specific condition
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return false;
};

// Export the renderWithProviders function for tests
export { renderWithProviders } from '@/utils/testRender';
