
declare namespace jest {
  interface Config {
    preset?: string;
    testEnvironment?: string;
    setupFilesAfterEnv?: string[];
    moduleNameMapper?: Record<string, string>;
    testMatch?: string[];
    transform?: Record<string, string | [string, Record<string, any>]>;
    collectCoverage?: boolean;
    collectCoverageFrom?: string[];
    coverageThreshold?: {
      global?: {
        branches?: number;
        functions?: number;
        lines?: number;
        statements?: number;
      };
    };
    coverageReporters?: string[];
    verbose?: boolean;
    testTimeout?: number;
    modulePathIgnorePatterns?: string[];
  }
}

declare module "ts-jest" {
  interface TsJestConfig {
    tsconfig: string;
  }
  
  interface InitialOptionsTsJest {
    tsconfig: string;
  }
}
