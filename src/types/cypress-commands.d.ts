
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // Custom Cypress commands
    tab(): Chainable<JQuery<HTMLElement>>
    checkAllLinks(): Chainable<Element>
    checkAccessibility(options?: any): Chainable<Element>
    captureAndCompare(name: string): Chainable<Element>
    login(email: string, password: string): Chainable<Element>
    loginAsAdmin(): Chainable<Element>
    testKeyboardNavigation(): Chainable<Element>
    testFormValidation(formSelector: string): Chainable<Element>
    // Existing command from cypress-image-snapshot
    matchImageSnapshot(name?: string, options?: object): Chainable<Element>
  }

  interface Cookies {
    preserveOnce(...cookies: string[]): void
  }

  interface CurrentTest {
    title: string
    titlePath: string[]
    state?: string
  }
}
