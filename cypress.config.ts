
/// <reference path="./src/types/cypress-index.d.ts" />

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // Register custom tasks
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
  
  // Environment variables
  env: {
    apiUrl: 'http://localhost:5173/api',
    coverage: true,
    codeCoverage: {
      exclude: ['cypress/**/*.*', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}']
    }
  },
  
  // Retry tests on failure
  retries: {
    runMode: 2,
    openMode: 0
  },
  
  // Default command timeout
  defaultCommandTimeout: 10000,
  
  // Wait before determining that a test has failed
  pageLoadTimeout: 60000
});
