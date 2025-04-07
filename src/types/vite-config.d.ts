
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
  }
}
