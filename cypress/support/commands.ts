
import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand();

// Custom authentication command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('include', '/app/dashboard');
});

// Custom admin login
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@example.com', 'admin123');
  cy.url().should('include', '/app/dashboard');
});

// Custom snapshot command with accessibility check
Cypress.Commands.add('captureAndCompare', (name: string) => {
  cy.checkA11y();
  cy.matchImageSnapshot(name);
});

// Command to check all links on a page
Cypress.Commands.add('checkAllLinks', () => {
  cy.get('a').each(($link) => {
    const href = $link.prop('href');
    if (href && !href.includes('javascript:void') && !href.includes('mailto:')) {
      cy.request({
        url: href,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 301, 302, 304]);
      });
    }
  });
});

// Command to test form inputs
Cypress.Commands.add('testFormInput', (selector: string, value: string, expectedError?: string) => {
  cy.get(selector).clear().type(value);
  cy.get(selector).blur();
  
  if (expectedError) {
    cy.get(`${selector}-error`).should('contain', expectedError);
  } else {
    cy.get(`${selector}-error`).should('not.exist');
  }
});

// Command to test interactive elements
Cypress.Commands.add('testInteractiveElement', (selector: string, action: 'click' | 'hover' | 'focus' | 'tab') => {
  switch (action) {
    case 'click':
      cy.get(selector).click();
      break;
    case 'hover':
      cy.get(selector).trigger('mouseover');
      break;
    case 'focus':
      cy.get(selector).focus();
      break;
    case 'tab':
      cy.get(selector).focus().tab();
      break;
  }
});

// Accessibility checks for the current page
Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y(null, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  });
});

// Test keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', () => {
  cy.get('body').focus();
  cy.get('body').tab();
  
  // Keep tabbing until we've reached all focusable elements
  let previousFocusedEl = null;
  let currentFocusedEl = null;
  let tabCount = 0;
  const maxTabs = 50; // Limit to prevent infinite loops
  
  const checkFocus = () => {
    cy.focused().then($el => {
      currentFocusedEl = $el[0];
      if (currentFocusedEl !== previousFocusedEl && tabCount < maxTabs) {
        previousFocusedEl = currentFocusedEl;
        tabCount++;
        cy.get('body').tab();
        checkFocus();
      }
    });
  };
  
  checkFocus();
});

// Command to test toast notifications
Cypress.Commands.add('testToast', (actionFn: () => void, expectedText: string) => {
  actionFn();
  cy.get('[data-testid="toast"]').should('contain', expectedText);
  cy.get('[data-testid="toast-close"]').click();
  cy.get('[data-testid="toast"]').should('not.exist');
});

// Add custom command types to Typescript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      captureAndCompare(name: string): Chainable<void>;
      checkAllLinks(): Chainable<void>;
      testFormInput(selector: string, value: string, expectedError?: string): Chainable<void>;
      testInteractiveElement(selector: string, action: 'click' | 'hover' | 'focus' | 'tab'): Chainable<void>;
      checkAccessibility(): Chainable<void>;
      testKeyboardNavigation(): Chainable<void>;
      testToast(actionFn: () => void, expectedText: string): Chainable<void>;
      injectAxe(): Chainable<void>;
      checkA11y(
        context?: string,
        options?: object,
        violationCallback?: (violations: any) => void,
        skipFailures?: boolean
      ): Chainable<void>;
      tab(): Chainable<void>;
      matchImageSnapshot(name?: string): Chainable<void>;
    }
  }
}

export {};
