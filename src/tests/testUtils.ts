
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Test utility functions to simplify common testing patterns
 */

/**
 * Wait for promises to resolve in tests
 */
export const waitForPromises = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Find element by test ID and assert existence
 */
export const getByTestIdAndAssert = (testId: string): HTMLElement => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  return element;
};

/**
 * Click button by text or test ID
 */
export const clickButton = (textOrTestId: string): void => {
  try {
    // Try to find by text first
    const button = screen.getByRole('button', { name: textOrTestId });
    fireEvent.click(button);
  } catch (e) {
    // Fall back to test ID
    const button = screen.getByTestId(textOrTestId);
    fireEvent.click(button);
  }
};

/**
 * Click button using userEvent for more realistic interaction
 */
export const clickButtonUser = async (textOrTestId: string): Promise<void> => {
  try {
    // Try to find by text first
    const button = screen.getByRole('button', { name: textOrTestId });
    await userEvent.click(button);
  } catch (e) {
    // Fall back to test ID
    const button = screen.getByTestId(textOrTestId);
    await userEvent.click(button);
  }
};

/**
 * Fill input by label or test ID
 */
export const fillInput = (labelOrTestId: string, value: string): void => {
  try {
    // Try to find by label text first
    const input = screen.getByLabelText(labelOrTestId);
    fireEvent.change(input, { target: { value } });
  } catch (e) {
    // Fall back to test ID
    const input = screen.getByTestId(labelOrTestId);
    fireEvent.change(input, { target: { value } });
  }
};

/**
 * Fill input using userEvent for more realistic interaction
 */
export const fillInputUser = async (labelOrTestId: string, value: string): Promise<void> => {
  try {
    // Try to find by label text first
    const input = screen.getByLabelText(labelOrTestId);
    await userEvent.clear(input);
    await userEvent.type(input, value);
  } catch (e) {
    // Fall back to test ID
    const input = screen.getByTestId(labelOrTestId);
    await userEvent.clear(input);
    await userEvent.type(input, value);
  }
};

/**
 * Wait for element to appear with custom error message
 */
export const waitForElement = async (
  testId: string, 
  timeoutMs = 1000, 
  errorMessage = `Element with testId "${testId}" not found`
): Promise<HTMLElement> => {
  return await waitFor(
    () => {
      const element = screen.getByTestId(testId);
      if (!element) throw new Error(errorMessage);
      return element;
    },
    { timeout: timeoutMs }
  );
};

/**
 * Helper to create a mock function with typed parameters and return value
 */
export function createMockFunction<T extends (...args: any[]) => any>(
  returnValue?: ReturnType<T>
): jest.MockedFunction<T> {
  return jest.fn(() => returnValue) as jest.MockedFunction<T>;
}

/**
 * Helper to create a partial object with mocked methods
 */
export function createPartialMock<T extends object>(
  implementations: Partial<{ [K in keyof T]: T[K] }>
): Partial<T> {
  return implementations;
}

/**
 * Helper to mock fetch
 */
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
  waitForPromises,
  getByTestIdAndAssert,
  clickButton,
  clickButtonUser,
  fillInput,
  fillInputUser,
  waitForElement,
  createMockFunction,
  createPartialMock,
  mockFetch
};
