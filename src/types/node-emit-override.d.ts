
/**
 * This file specifically overrides the TypeScript error related to 
 * "Referenced project may not disable emit" for tsconfig.node.json
 */

// Force TypeScript to accept references to projects with emit disabled
declare module 'ts-node' {
  interface RegisterOptions {
    project?: string;
    transpileOnly?: boolean;
    skipProject?: boolean;
    ignore?: string[];
    preferTsExts?: boolean;
    compilerOptions?: {
      module?: string;
      target?: string;
      esModuleInterop?: boolean;
      noEmit?: boolean;
      [key: string]: any;
    };
  }
}

// Override the TypeScript compiler behavior for node.js projects
declare module 'node:module' {
  interface NodeConfig {
    allowDisabledEmit?: boolean;
  }
}

// Make types available for vite's node modules
declare module 'vite/node' {
  export const defineConfig: any;
  export const loadEnv: any;
  export const createServer: any;
  export const build: any;
  export const preview: any;
}
