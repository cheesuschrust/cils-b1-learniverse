
// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-axe';
import '@cypress/code-coverage/support';

// Disable specific console errors in the Cypress browser to reduce noise in test output
// Fix: Use string literal to avoid using namespace as a value
Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error').callsFake((msg) => {
    // Allow the error to be logged to the console but fail the test if it's not an expected error
    if (
      !msg.includes('ResizeObserver') && // Common React warning
      !msg.includes('act(...)') && // React testing warning
      !msg.includes('validateDOMNesting') && // DOM nesting validation
      !msg.includes('browserHasNativePerformanceObserver') // Performance observer warning
    ) {
      throw new Error(`Console error: ${msg}`);
    }
  });

  // Suppress specific warnings as well
  cy.stub(win.console, 'warn').callsFake((msg) => {
    if (
      !msg.includes('React does not recognize the') && // React prop warnings
      !msg.includes('You provided a `checked` prop to a form field') // Form field warnings
    ) {
      console.warn(msg);
    }
  });
});

// Store cookies between tests (using Cypress v10+ approach)
// The old preserveOnce method is deprecated
beforeEach(() => {
  // Get cookies from previous tests
  const cookies = Cypress.env('cookies') || [];
  if (cookies.length > 0) {
    cookies.forEach(cookie => {
      cy.setCookie(cookie.name, cookie.value);
    });
  }
});

afterEach(() => {
  // Save cookies for next test
  cy.getCookies().then(cookies => {
    Cypress.env('cookies', cookies);
  });
});

// Global after hook for all tests
after(() => {
  cy.clearAllLocalStorage();
  cy.clearAllCookies();
});

// Make test results easier to read
// Fix: Use string literal to avoid using namespace as a value
Cypress.SelectorPlayground.defaults({
  selectorPriority: [
    'data-testid',
    'data-cy',
    'id',
    'class',
    'tag',
    'attributes',
    'nth-child',
  ],
});

// Add a11y check to every test
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const result = originalFn(url, options);
  cy.injectAxe();
  return result;
});

// Log test name
beforeEach(() => {
  const test = Cypress.currentTest;
  cy.task('log', `Running: ${test.title}`);
});

// Report test results
afterEach(() => {
  const test = Cypress.currentTest;
  if (test && typeof test === 'object') {
    const message = test.state === 'passed' 
      ? `✅ TEST PASSED: ${test.title}` 
      : `❌ TEST FAILED: ${test.title}`;
    cy.task('log', message);
  }
});
