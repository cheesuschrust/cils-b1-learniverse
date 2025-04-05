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
    
    // A11y testing
    injectAxe(): Chainable<Element>
    checkA11y(options?: any): Chainable<Element>
    
    // For React component testing
    mount(component: React.ReactNode, options?: any): Chainable<Element>
  }

  interface Cookies {
    preserveOnce(...cookies: string[]): void
  }

  interface CurrentTest {
    title: string
    titlePath: string[]
    state?: string
  }
  
  // Cypress Plugin types
  interface PluginEvents {
    (action: string, ...args: any[]): any;
  }
  
  interface PluginConfigOptions {
    [key: string]: any;
  }
}

// For proper typing of cy global
declare const cy: Cypress.Chainable;
declare const expect: Chai.ExpectStatic;
declare const assert: Chai.AssertStatic;
declare const describe: Mocha.SuiteFunction;
declare const context: Mocha.SuiteFunction;
declare const it: Mocha.TestFunction;
declare const test: Mocha.TestFunction;
declare const beforeEach: Mocha.HookFunction;
declare const afterEach: Mocha.HookFunction;
declare const before: Mocha.HookFunction;
declare const after: Mocha.HookFunction;
