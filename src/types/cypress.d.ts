
declare namespace Cypress {
  interface PluginEvents {
    (action: string, callback: (...args: any[]) => any): void;
  }

  interface PluginConfigOptions {
    [key: string]: any;
  }
}

declare module 'cypress' {
  interface PluginEvents {
    (action: string, callback: (...args: any[]) => any): void;
  }

  interface PluginConfigOptions {
    [key: string]: any;
  }
}
