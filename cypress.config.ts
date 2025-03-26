
import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      addMatchImageSnapshotPlugin(on, config);
      codeCoverageTask(on, config);
      
      // Additional custom tasks can be added here
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
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
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
