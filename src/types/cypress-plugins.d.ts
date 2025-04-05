
declare namespace Cypress {
  interface PluginEvents {
    (action: string, ...args: any[]): any;
  }
  
  interface PluginConfigOptions {
    [key: string]: any;
  }
}

interface NodeRequire {
  ensure(paths: string[], callback: (require: NodeRequire) => void, chunkName: string): void;
}
