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
    
    // Missing methods that caused the errors
    should(chainer: string, value?: any): Chainable<JQuery<HTMLElement>>
    should(chainers: string, value: any, match: any): Chainable<JQuery<HTMLElement>>
    should(chainers: string, match: RegExp): Chainable<JQuery<HTMLElement>>
    should(chainers: string, value: any, match: string): Chainable<JQuery<HTMLElement>>
    should(fn: (currentSubject: JQuery<HTMLElement>) => void): Chainable<JQuery<HTMLElement>>
    
    click(options?: Partial<Cypress.ClickOptions>): Chainable<JQuery<HTMLElement>>
    type(text: string, options?: Partial<Cypress.TypeOptions>): Chainable<JQuery<HTMLElement>>
    clear(options?: Partial<Cypress.ClearOptions>): Chainable<JQuery<HTMLElement>>
    select(text: string | string[], options?: Partial<Cypress.SelectOptions>): Chainable<JQuery<HTMLElement>>
    first(options?: object): Chainable<JQuery<HTMLElement>>
    check(options?: Partial<Cypress.CheckOptions>): Chainable<JQuery<HTMLElement>>
    focus(options?: Partial<Cypress.Loggable>): Chainable<JQuery<HTMLElement>>
    as(alias: string): Chainable<JQuery<HTMLElement>>
    each(fn: (currentElement: JQuery<HTMLElement>, index: number, elements: JQuery<HTMLElement>[]) => void): Chainable<JQuery<HTMLElement>>
    wrap<E>(element: E, options?: Partial<Cypress.Loggable>): Chainable<E>
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
