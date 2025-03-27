
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/mocks/fileMock.js'
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  // Disable coverage for now to simplify the build
  collectCoverage: false,
  // Add timeout to prevent long-running tests
  testTimeout: 10000,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Automatically clear mock calls and instances between tests
  clearMocks: true,
  // Restore mocks between tests, this preserves the mock implementation
  restoreMocks: true,
  // Reset modules between test runs to prevent shared state
  resetModules: true,
  // Force full test runs to avoid stale cache issues
  bail: 0
};
