
/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    // Custom commands
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
    
    // Basic Cypress commands that need to be explicitly defined
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
    request(url: string | object): Chainable<Response>;
    request(method: string, url: string, body?: any): Chainable<Response>;
    fixture(path: string, options?: { encoding: string }): Chainable<any>;
    document(): Chainable<Document>;
    stub(): Chainable<sinon.SinonStub>;
    getCookies(): Chainable<Cypress.Cookie[]>;
    setCookie(name: string, value: string, options?: Partial<Cypress.SetCookieOptions>): Chainable<null>;
    log(message: string): Chainable<null>;
    task(event: string, arg?: any, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Chainable<any>;
    
    // Methods that caused errors
    should(chainer: string, value?: any): Chainable<Subject>;
    should(chainers: string, value: any, match: any): Chainable<Subject>;
    should(chainers: string, match: RegExp): Chainable<Subject>;
    should(chainers: string, value: any, match: string): Chainable<Subject>;
    should<S = any>(fn: (currentSubject: Subject) => void): Chainable<Subject>;
    
    click(options?: Partial<Cypress.ClickOptions>): Chainable<Subject>;
    type(text: string, options?: Partial<Cypress.TypeOptions>): Chainable<Subject>;
    clear(options?: Partial<Cypress.ClearOptions>): Chainable<Subject>;
    select(text: string | string[], options?: Partial<Cypress.SelectOptions>): Chainable<Subject>;
    first(options?: object): Chainable<Subject>;
    check(options?: Partial<Cypress.CheckOptions>): Chainable<Subject>;
    focus(): Chainable<Subject>;
    as(alias: string): Chainable<Subject>;
    each(fn: (currentElement: JQuery<HTMLElement>, index: number, elements: JQuery<HTMLElement>[]) => void): Chainable<JQuery<HTMLElement>>;
    wrap<E>(element: E, options?: Partial<Cypress.Loggable>): Chainable<E>;
    trigger(eventName: string, options?: object): Chainable<Subject>;
    
    // For React component testing
    mount(component: React.ReactNode, options?: any): Chainable<Element>;
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

  // Add missing type for CurrentTest
  interface Cypress {
    currentTest: CurrentTest;
  }
}

// For proper typing of cy global
declare const cy: Cypress.Chainable;
declare const expect: Chai.ExpectStatic;
declare const assert: Chai.AssertStatic;
