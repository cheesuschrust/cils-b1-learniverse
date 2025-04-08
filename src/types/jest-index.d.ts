
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
    testTimeout?: number;
    modulePathIgnorePatterns?: string[];
    testPathIgnorePatterns?: string[]; // Added missing property
    bail?: number;
    clearMocks?: boolean;
    restoreMocks?: boolean;
    resetModules?: boolean;
    watchPlugins?: string[];
    maxWorkers?: string;
    verbose?: boolean;
  }

  export interface ConfigAPI {
    cache: boolean;
    clearCache: () => void;
    getTestEnvironment: (config: Config) => string;
    getSerializers: () => any[];
    getMaxWorkers: (config: Config) => number;
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
