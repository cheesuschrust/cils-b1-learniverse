
declare namespace jest {
  interface Config {
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
  interface InitialOptionsTsJest {
    tsconfig?: string;
    isolatedModules?: boolean;
  }
}
