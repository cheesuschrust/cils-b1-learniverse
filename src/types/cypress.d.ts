
/// <reference types="cypress" />

declare namespace Cypress {
  interface PluginEvents {
    (action: string, callback: (...args: any[]) => any): void;
  }

  interface PluginConfigOptions {
    [key: string]: any;
  }
}

export {};
