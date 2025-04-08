
// This extends the @testing-library/jest-dom matchers
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number | null): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toContainElement(element: HTMLElement | null): R;
    }
  }
}
