
/// <reference types="cypress" />

declare namespace Cypress {
  interface PluginEvents {
    (action: string, callback: (...args: any[]) => any): void;
  }

  interface PluginConfigOptions {
    [key: string]: any;
  }

  // Add missing task interface
  interface Tasks {
    log(message: string): null;
    table(message: unknown): null;
  }
}

// Also declare the global function
declare function defineConfig(config: any): any;
