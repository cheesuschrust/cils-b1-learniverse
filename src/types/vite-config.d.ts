
declare module 'vite' {
  interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    build?: {
      outDir?: string;
      emptyOutDir?: boolean;
      rollupOptions?: any;
    };
    server?: {
      port?: number;
      strictPort?: boolean;
      open?: boolean | string;
    };
    preview?: {
      port?: number;
    };
    test?: {
      globals?: boolean;
      environment?: string;
      setupFiles?: string[];
      include?: string[];
      coverage?: {
        reporter?: string[];
        exclude?: string[];
      };
    };
    define?: Record<string, any>;
    optimizeDeps?: {
      include?: string[];
      exclude?: string[];
    };
    css?: Record<string, any>;
  }

  export function defineConfig(config: UserConfig): UserConfig;
}
