/// <reference types="vite/client" />  
import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import * as path from 'path';  

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
      }),
    ],
    
    // Server Configuration  
    server: {  
      port: 8080,  
      host: true,  
      open: true, 
      strictPort: true,
      hmr: {
        overlay: true,
      },
    },  
    
    // Resolve Aliases  
    resolve: {  
      alias: {  
        '@': path.resolve(__dirname, 'src'),  
        '@components': path.resolve(__dirname, 'src/components'),  
        '@hooks': path.resolve(__dirname, 'src/hooks'),  
        '@utils': path.resolve(__dirname, 'src/utils'),  
        '@types': path.resolve(__dirname, 'src/types'),  
        '@routes': path.resolve(__dirname, 'src/routes'),  
        '@context': path.resolve(__dirname, 'src/contexts'),
      }  
    },  
    
    // Dependency Optimization  
    optimizeDeps: {  
      include: [  
        'react',  
        'react-dom',  
        'react-router-dom',  
        '@hookform/resolvers',  
        'class-variance-authority',  
        'clsx',  
        'lucide-react',
        'tailwind-merge',
        'react-hook-form',
        '@tailwindcss/postcss',
      ],  
      force: true  
    },  
    
    // Build Configuration  
    build: {  
      outDir: 'dist',  
      sourcemap: mode === 'development',  
      minify: mode === 'production',
      target: 'es2020', // Align with tsconfig.json
      commonjsOptions: {  
        transformMixedEsModules: true  
      },  
      rollupOptions: {  
        output: {  
          manualChunks(id) {  
            if (id.includes('node_modules')) {  
              return 'vendor';  
            }
            return undefined;
          }
        }  
      }  
    },  
    
    // CSS Configuration
    css: {
      postcss: './postcss.config.cjs',
      modules: {
        localsConvention: 'camelCase',
      },
    },
    
    // Testing Configuration  
    test: {  
      globals: true,  
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      coverage: {  
        provider: 'v8',  
        reporter: ['text', 'json', 'html']  
      }  
    },

    // TypeScript Configuration
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  };
});
