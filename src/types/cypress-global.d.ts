
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    // Commands
    login(email: string, password: string): Chainable<Element>;
    logout(): Chainable<Element>;
    checkA11y(options?: any): Chainable<Element>;
    injectAxe(): Chainable<Element>;
    tab(): Chainable<Element>;
    matchImageSnapshot(name?: string, options?: object): Chainable<Element>;
    
    // Basic selectors and actions that TypeScript complains about
    get(selector: string, options?: any): Chainable<Element>;
    find(selector: string, options?: any): Chainable<Element>;
    contains(content: string | number | RegExp, options?: any): Chainable<Element>;
    contains(selector: string, content: string | number | RegExp, options?: any): Chainable<Element>;
    click(options?: any): Chainable<Element>;
    type(text: string, options?: any): Chainable<Element>;
    clear(options?: any): Chainable<Element>;
    should(chainer: string, value?: any): Chainable<Element>;
    should(chainers: string, value: any, match: any): Chainable<Element>;
    should(fn: (element: any) => boolean): Chainable<Element>;
  }

  interface PluginEvents {
    (action: string, ...args: any[]): Promise<any>;
  }
  
  interface PluginConfigOptions {
    [key: string]: any;
  }
}
