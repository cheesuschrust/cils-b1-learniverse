
declare module "jest-axe" {
  import { AxeResults } from "axe-core";

  interface JestAxeConfigureOptions {
    rules?: {
      [key: string]: {
        enabled: boolean;
        [key: string]: any;
      };
    };
    [key: string]: any;
  }

  export interface AxeOptions {
    runOnly?: {
      type: "tag" | "rule";
      values: string[];
    };
    rules?: {
      [key: string]: {
        enabled: boolean;
      };
    };
    iframes?: boolean;
    elementRef?: boolean;
    selectors?: boolean;
    resultTypes?: ("violations" | "incomplete" | "inapplicable" | "passes")[];
    [key: string]: any;
  }

  export interface JestAxe {
    (html: Element | string, options?: AxeOptions): Promise<AxeResults>;
    configure(options: JestAxeConfigureOptions): JestAxe;
  }

  const axe: JestAxe;
  export default axe;

  export interface ToAxeResults {
    pass: boolean;
    message: () => string;
  }

  export function toHaveNoViolations(results: AxeResults): ToAxeResults;
  
  export interface Result {
    id: string;
    impact: string;
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: {
      target: string[];
      html: string;
      [key: string]: any;
    }[];
  }
}

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toHaveNoViolations(): R;
    }
  }
}
