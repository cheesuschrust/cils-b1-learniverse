
declare module 'jest-axe' {
  import { AxeResults } from 'axe-core';

  export interface RunOptions {
    runOnly?: {
      type: 'tag' | 'rule';
      values: string[];
    };
    rules?: {
      [key: string]: {
        enabled: boolean;
      };
    };
    reporter?: 'v1' | 'v2' | 'no-passes';
    resultTypes?: Array<'passes' | 'violations' | 'incomplete' | 'inapplicable'>;
    selectors?: boolean;
    ancestry?: boolean;
    xpath?: boolean;
    absolutePaths?: boolean;
    iframes?: boolean;
    elementRef?: boolean;
    frameWaitTime?: number;
    preload?: boolean;
    pingWaitTime?: number;
  }

  export interface AxeMatchers<R = unknown> {
    toHaveNoViolations(): R;
  }

  declare global {
    namespace jest {
      interface Matchers<R> extends AxeMatchers<R> {}
    }
  }

  type JestAxe = {
    (html: Element | string, options?: RunOptions): Promise<AxeResults>;
    configureAxe(options?: RunOptions): JestAxe;
  };

  const axe: JestAxe;
  export default axe;
}
