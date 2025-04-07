
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
    bail?: number;
    clearMocks?: boolean;
    restoreMocks?: boolean;
    resetModules?: boolean;
    watchPlugins?: string[];
    maxWorkers?: string;
  }
}
