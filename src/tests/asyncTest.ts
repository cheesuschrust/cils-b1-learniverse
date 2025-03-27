
/**
 * Testing helpers for async operations
 */

/**
 * Waits for all pending promises to resolve
 * @returns Promise that resolves when microtask queue is empty
 */
export const flushPromises = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Waits for the specified time
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Waits for a condition to be met
 * @param condition Function that returns true when condition is met
 * @param timeout Maximum time to wait in milliseconds
 * @param interval Check interval in milliseconds
 * @returns Promise that resolves when condition is met, or rejects on timeout
 */
export const waitForCondition = (
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Condition not met within ${timeout}ms`));
        return;
      }
      
      setTimeout(check, interval);
    };
    
    check();
  });
};

/**
 * Creates a deferred promise for manual control
 * @returns Object with promise, resolve and reject functions
 */
export const createDeferred = <T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
} => {
  let resolve!: (value: T) => void;
  let reject!: (reason: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return { promise, resolve, reject };
};

/**
 * Retries a function until it succeeds or reaches the maximum number of attempts
 * @param fn Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param delay Delay between attempts in milliseconds
 * @returns Promise that resolves with the function result, or rejects after all attempts fail
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 300
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        await wait(delay);
      }
    }
  }
  
  throw lastError;
};
