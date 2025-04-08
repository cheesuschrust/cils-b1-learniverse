
declare module 'jest' {
  export interface Config {
    preset?: string;
    testEnvironment?: string;
    setupFilesAfterEnv?: string[];
    moduleNameMapper?: Record<string, string>;
    testMatch?: string[];
    transform?: Record<string, any>;
    collectCoverage?: boolean;
    collectCoverageFrom?: string[];
    coverageThreshold?: Record<string, any>;
    coverageReporters?: string[];
    verbose?: boolean;
    testTimeout?: number;
    modulePathIgnorePatterns?: string[];
  }
}

declare module 'ts-jest' {
  export function pathsToModuleNameMapper(
    paths: Record<string, string[]>,
    options: { prefix: string }
  ): Record<string, string>;
  
  export interface InitialOptionsTsJest {
    tsconfig?: string;
    isolatedModules?: boolean;
  }
}
