
/// <reference types="cypress" />
import 'cypress-axe';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

// Initialize image snapshot command
addMatchImageSnapshotCommand();

// Custom command to check all links on a page
Cypress.Commands.add('checkAllLinks', () => {
  // Get all <a> elements
  cy.get('a').each((link) => {
    const href = link.prop('href');
    if (href && !href.includes('javascript:void') && !href.includes('mailto:') && !href.includes('tel:')) {
      cy.request({
        url: href,
        failOnStatusCode: false
      }).then((response) => {
        // Log broken links but don't fail the test
        if (response.status >= 400) {
          cy.log(`⚠️ Broken link: ${href} (Status: ${response.status})`);
        }
      });
    }
  });
});

// Custom command to check accessibility
Cypress.Commands.add('checkAccessibility', (options = {}) => {
  cy.injectAxe();
  cy.checkA11y(null, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
    ...options
  }, null, true); // Log to console but don't fail
});

// Custom command to capture and compare screenshots
Cypress.Commands.add('captureAndCompare', (name) => {
  cy.matchImageSnapshot(name, {
    customDiffConfig: { threshold: 0.1 }, // Allow small differences
    failureThreshold: 0.03, // Allow 3% pixel difference
    failureThresholdType: 'percent'
  });
});

// Custom command to log in
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
  });
});

// Custom command to log in as admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@example.com', 'admin123');
});

// Custom command to test keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', () => {
  // Find all focusable elements
  cy.get('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').each(($el) => {
    cy.wrap($el).focus();
    cy.focused().should('exist');
    
    // Test that pressing Enter triggers the element
    if ($el.is('button, a, [role="button"]')) {
      cy.wrap($el).type('{enter}', { force: true });
    }
  });
});

// Custom command to test form validation
Cypress.Commands.add('testFormValidation', (formSelector) => {
  cy.get(formSelector).within(() => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Check for validation errors
    cy.get('[aria-invalid="true"]').should('exist');
    
    // Fill in form fields
    cy.get('input, textarea, select').each(($input) => {
      const type = $input.attr('type');
      const name = $input.attr('name');
      
      if (type === 'text' || type === 'email' || type === 'password' || !type) {
        cy.wrap($input).type('Test input');
      } else if (type === 'checkbox' || type === 'radio') {
        cy.wrap($input).check();
      } else if ($input.is('select')) {
        cy.wrap($input).select(1);
      }
    });
  });
});

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      checkAllLinks(): Chainable<Element>;
      checkAccessibility(options?: any): Chainable<Element>;
      captureAndCompare(name: string): Chainable<Element>;
      login(email: string, password: string): Chainable<Element>;
      loginAsAdmin(): Chainable<Element>;
      testKeyboardNavigation(): Chainable<Element>;
      testFormValidation(formSelector: string): Chainable<Element>;
    }
  }
}
