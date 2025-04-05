/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    // Existing commands from cypress.d.ts
    tab(): Chainable<Element>;
    checkAllLinks(): Chainable<Element>;
    checkAccessibility(options?: any): Chainable<Element>;
    captureAndCompare(name: string): Chainable<Element>;
    login(email: string, password: string): Chainable<Element>;
    loginAsAdmin(): Chainable<Element>;
    testKeyboardNavigation(): Chainable<Element>;
    testFormValidation(formSelector: string): Chainable<Element>;
    matchImageSnapshot(name?: string, options?: object): Chainable<Element>;
    
    // A11y testing commands
    injectAxe(): Chainable<Element>;
    checkA11y(options?: any): Chainable<Element>;
    
    // Common Cypress commands
    visit(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<Element>;
    get(selector: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<Element>;
    contains(content: string | number | RegExp, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<Element>;
    contains(selector: string, content: string | number | RegExp, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<Element>;
    within(selector: string | JQuery<HTMLElement>, callback: Function): Chainable<Element>;
    within(callback: Function): Chainable<Element>;
    url(): Chainable<string>;
    wait(milliseconds: number): Chainable<Element>;
    wait(alias: string, options?: Partial<Cypress.Timeoutable>): Chainable<Element>;
    focused(): Chainable<Element>;
    reload(forceReload?: boolean): Chainable<Window>;
    go(direction: 'back' | 'forward'): Chainable<Window>;
    go(numberOrString: number | string): Chainable<Window>;
    viewport(width: number, height: number): Chainable<Element>;
    viewport(preset: string): Chainable<Element>;
    clearCookies(options?: Partial<Cypress.Loggable>): Chainable<Element>;
    clearLocalStorage(keys?: string | string[]): Chainable<Element>;
    clearAllLocalStorage(): Chainable<Element>;
    clearAllCookies(): Chainable<Element>;
    intercept(url: string | RegExp, response?: string | object): Chainable<Element>;
    intercept(method: string, url: string | RegExp, response?: string | object): Chainable<Element>;
    intercept(alias: string, url: string | RegExp, response?: string | object): Chainable<Element>;
    
    // For React component testing
    mount(component: React.ReactNode, options?: any): Chainable<Element>;
    
    // Task execution
    task(event: string, arg?: any, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Chainable<any>;
  }

  interface Cookies {
    preserveOnce(...cookies: string[]): void;
  }

  interface CurrentTest {
    title: string;
    titlePath: string[];
    state?: string;
  }
  
  // Cypress Plugin types
  interface PluginEvents {
    (action: string, ...args: any[]): any;
  }
  
  interface PluginConfigOptions {
    [key: string]: any;
  }
}
