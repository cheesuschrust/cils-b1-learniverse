
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
    
    // Missing methods that caused the errors
    should(chainer: string, value?: any): Chainable<JQuery<HTMLElement>>
    should(chainers: string, value: any, match: any): Chainable<JQuery<HTMLElement>>
    should(chainers: string, match: RegExp): Chainable<JQuery<HTMLElement>>
    should(chainers: string, value: any, match: string): Chainable<JQuery<HTMLElement>>
    should<S = any>(fn: (currentSubject: JQuery<HTMLElement>) => void): Chainable<JQuery<HTMLElement>>
    
    click(options?: Partial<Cypress.ClickOptions>): Chainable<JQuery<HTMLElement>>
    type(text: string, options?: Partial<Cypress.TypeOptions>): Chainable<JQuery<HTMLElement>>
    clear(options?: Partial<Cypress.ClearOptions>): Chainable<JQuery<HTMLElement>>
    select(text: string | string[], options?: Partial<Cypress.SelectOptions>): Chainable<JQuery<HTMLElement>>
    first(options?: object): Chainable<JQuery<HTMLElement>>
    check(options?: Partial<Cypress.CheckOptions>): Chainable<JQuery<HTMLElement>>
    focus(options?: Partial<Cypress.Loggable>): Chainable<JQuery<HTMLElement>>
    focused(): Chainable<JQuery<HTMLElement>>
    as(alias: string): Chainable<JQuery<HTMLElement>>
    each(fn: (currentElement: JQuery<HTMLElement>, index: number, elements: JQuery<HTMLElement>[]) => void): Chainable<JQuery<HTMLElement>>
    wrap<E>(element: E, options?: Partial<Cypress.Loggable>): Chainable<E>
    trigger(eventName: string, options?: object): Chainable<JQuery<HTMLElement>>
    request(url: string | object): Chainable<Response>
    request(method: string, url: string, body?: any): Chainable<Response>
    fixture(path: string, options?: { encoding: string }): Chainable<any>
    document(): Chainable<Document>
    stub(): Chainable<sinon.SinonStub>
    getCookies(): Chainable<Cypress.Cookie[]>
    setCookie(name: string, value: string, options?: Partial<Cypress.SetCookieOptions>): Chainable<null>
    log(message: string): Chainable<null>
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
