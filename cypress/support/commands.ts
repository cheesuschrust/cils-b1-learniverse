// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand();

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@example.com', 'adminPassword123!');
  cy.url().should('include', '/admin/dashboard');
});

Cypress.Commands.add('checkAllLinks', () => {
  cy.get('a').each(($link) => {
    const href = $link.prop('href');
    if (href && !href.includes('javascript:void') && !href.includes('mailto:') && !href.includes('tel:')) {
      cy.request({
        url: href,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.lt(400);
      });
    }
  });
});

Cypress.Commands.add('checkAccessibility', (options = {}) => {
  cy.injectAxe();
  cy.checkA11y(options);
});

Cypress.Commands.add('tab', () => {
  const keyboardEventOptions = { keyCode: 9, which: 9, key: 'Tab', code: 'Tab', bubbles: true };
  cy.focused().trigger('keydown', keyboardEventOptions);
  return cy.document().trigger('keydown', keyboardEventOptions);
});

Cypress.Commands.add('captureAndCompare', (name: string) => {
  cy.matchImageSnapshot(name);
});

Cypress.Commands.add('testKeyboardNavigation', () => {
  cy.get('body').focus();
  let focusableElements: JQuery<HTMLElement>[] = [];
  
  cy.get('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').each(($el) => {
    if ($el.is(':visible') && !$el.attr('disabled')) {
      focusableElements.push($el);
    }
  }).then(() => {
    cy.log(`Found ${focusableElements.length} focusable elements`);
    
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      cy.tab().then(() => {
        const focused = Cypress.$(document.activeElement);
        expect(focused.length).to.equal(1);
      });
    }
  });
});

Cypress.Commands.add('testFormValidation', (formSelector: string) => {
  cy.get(formSelector).within(() => {
    cy.get('input[required], select[required], textarea[required]').each(($input) => {
      const inputType = $input.attr('type');
      if (inputType === 'checkbox' || inputType === 'radio') {
        // Skip checkboxes and radios
        return;
      }
      
      cy.wrap($input).clear();
      cy.get('button[type="submit"]').click();
      cy.wrap($input).should('have.attr', 'aria-invalid', 'true');
    });
  });
});
