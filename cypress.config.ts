
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // We'll add image snapshot and code coverage plugins when they're installed
      
      // Additional custom tasks can be added here
      on('task', {
        log(message: string) {
          console.log(message);
          return null;
        },
        table(message: unknown) {
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
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // We'll add image snapshot plugin when it's installed
      return config;
    },
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
