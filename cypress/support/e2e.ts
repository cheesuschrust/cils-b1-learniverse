
// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-axe';
import '@cypress/code-coverage/support';

// Disable specific console errors in the Cypress browser to reduce noise in test output
Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error').callsFake((msg) => {
    // Allow the error to be logged to the console but fail the test if it's not an expected error
    if (
      !msg.includes('ResizeObserver') && // Common React warning
      !msg.includes('act(...)') && // React testing warning
      !msg.includes('validateDOMNesting') // DOM nesting validation
    ) {
      throw new Error(`Console error: ${msg}`);
    }
  });
});

// Preserve cookies between tests
beforeEach(() => {
  Cypress.Cookies.preserveOnce('authToken', 'user', 'preferences');
});

// Global after hook for all tests
after(() => {
  cy.clearAllLocalStorage();
  cy.clearAllCookies();
});
