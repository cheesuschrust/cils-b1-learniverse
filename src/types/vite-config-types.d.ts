
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
    };
    server?: {
      port?: number;
      strictPort?: boolean;
      open?: boolean | string;
    };
    preview?: {
      port?: number;
    };
  }

  export function defineConfig(config: UserConfig | ((env: { mode: string }) => UserConfig)): UserConfig;
}
