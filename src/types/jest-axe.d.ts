
declare module 'jest-axe' {
  import { AxeResults } from 'axe-core';

  export interface JestAxeConfigureOptions {
    globalOptions?: Record<string, any>;
    rules?: Record<string, { enabled: boolean }>;
    checks?: Record<string, { enabled: boolean }>;
  }

  export interface ToAXEMatchers<R = any> {
    toHaveNoViolations(): R;
  }

  export interface AxeRuleObject {
    id: string;
    enabled: boolean;
  }

  export interface JestAxeOptions {
    runOnly?: {
      type: 'tag' | 'rule';
      values: string[];
    } | string[] | string;
    rules?: AxeRuleObject[];
    context?: {
      include?: string[][] | string[];
      exclude?: string[][] | string[];
    };
    elementRef?: boolean;
    iframes?: boolean;
    selectors?: boolean;
    resultTypes?: string[];
    xpath?: boolean;
  }

  export function configureAxe(options: JestAxeConfigureOptions): void;
  export function axe(html: Element | string, options?: JestAxeOptions): Promise<AxeResults>;
  export function toHaveNoViolations(): {
    compare(received: AxeResults): { pass: boolean; message: () => string };
  };
  
  export function getViolations(results: AxeResults): Array<any>;
  
  export interface JestMatchers<R> extends ToAXEMatchers<R> {}
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}
