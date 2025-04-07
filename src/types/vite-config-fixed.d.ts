
/// <reference types="vite/client" />

declare module 'vite' {
  export interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    build?: {
      outDir?: string;
      emptyOutDir?: boolean;
      rollupOptions?: any;
      sourcemap?: boolean;
      minify?: boolean;
      commonjsOptions?: {
        transformMixedEsModules?: boolean;
      };
    };
    server?: {
      port?: number;
      host?: string | boolean;
      strictPort?: boolean;
      open?: boolean | string;
    };
    preview?: {
      port?: number;
    };
    optimizeDeps?: {
      include?: string[];
      force?: boolean;
    };
    test?: {
      globals?: boolean;
      environment?: string;
      setupFiles?: string[];
      coverage?: {
        provider?: string;
        reporter?: string[];
      };
    };
  }

  export function defineConfig(config: UserConfig | ((mode: { mode: string }) => UserConfig)): UserConfig;
}
