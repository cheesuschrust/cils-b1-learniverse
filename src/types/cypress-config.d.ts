
declare module "cypress" {
  export interface PluginEvents {
    (action: string, callback: (...args: any[]) => any): void;
  }

  export interface PluginConfigOptions {
    [key: string]: any;
  }

  export interface UserConfig {
    e2e?: {
      baseUrl?: string;
      specPattern?: string;
      viewportWidth?: number;
      viewportHeight?: number;
      video?: boolean;
      screenshotOnRunFailure?: boolean;
      setupNodeEvents?: (on: PluginEvents, config: PluginConfigOptions) => PluginConfigOptions | void;
    };
    component?: {
      devServer?: {
        framework?: string;
        bundler?: string;
      };
      specPattern?: string;
      setupNodeEvents?: (on: PluginEvents, config: PluginConfigOptions) => PluginConfigOptions | void;
    };
    env?: Record<string, any>;
    retries?: {
      runMode?: number;
      openMode?: number;
    };
    defaultCommandTimeout?: number;
    pageLoadTimeout?: number;
  }

  export function defineConfig(config: UserConfig | ((config: any) => UserConfig)): UserConfig;
}

// Define Cypress namespace globally to avoid compilation errors
declare namespace Cypress {
  interface PluginEvents {
    (action: string, callback: (...args: any[]) => any): void;
  }

  interface PluginConfigOptions {
    [key: string]: any;
  }
}
