
declare module 'jest-axe' {
  import { ElementHandle } from '@playwright/test';

  interface AxeResults {
    violations: AxeViolation[];
    passes: AxePass[];
    incomplete: AxeIncomplete[];
    inapplicable: AxeInapplicable[];
  }

  interface AxeViolation {
    id: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: AxeNode[];
  }

  interface AxePass {
    id: string;
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: AxeNode[];
  }

  interface AxeIncomplete {
    id: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: AxeNode[];
  }

  interface AxeInapplicable {
    id: string;
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: AxeNode[];
  }

  interface AxeNode {
    html: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    target: string[];
    failureSummary?: string;
  }

  interface AxeOptions {
    reporter?: 'v1' | 'v2';
    runOnly?: {
      type: 'tag' | 'rule';
      values: string[];
    };
    rules?: Record<string, Omit<RunOptions, 'checks'> & {
      checks?: Record<string, Partial<RunOptions>>;
    }>;
  }

  interface RunOptions {
    enabled: boolean;
    id?: string;
    selector?: string;
    matches?: string;
    excludeHidden?: boolean;
    options?: Record<string, unknown>;
  }

  function configureAxe(options: AxeOptions): AxeOptions;
  function configureAxe(options: AxeOptions): Partial<AxeOptions>;

  function axe(
    element: HTMLElement | ElementHandle,
    options?: Partial<AxeOptions>
  ): Promise<AxeResults>;

  function toHaveNoViolations(): void;
  
  namespace axe {
    const configure: typeof configureAxe;
  }

  export { axe, toHaveNoViolations, configureAxe };
  export default axe;
}
