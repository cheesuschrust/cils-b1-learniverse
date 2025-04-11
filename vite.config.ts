
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
        // Add babel configuration to help with React imports
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        }
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
        // Add explicit React and Recharts imports to fix module resolution
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'recharts': path.resolve(__dirname, 'node_modules/recharts')
      },
      // Add mainFields to prioritize ESM versions
      mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main'],
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
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
        'tailwindcss',
        'autoprefixer',
        'recharts',
        '@radix-ui/react-toast',
        'zod'
      ],
      // Force optimization even for pre-bundled deps
      force: true,
      // Ensure proper handling of ESM/CJS mixed modules
      esbuildOptions: {
        target: 'es2020',
        jsx: 'automatic',
        jsxImportSource: 'react',
        // Helps with module resolution errors
        define: {
          'process.env.NODE_ENV': JSON.stringify(mode)
        }
      }
    },
    
    // Build Configuration  
    build: {  
      outDir: 'dist',  
      sourcemap: mode === 'development',  
      minify: mode === 'production',
      target: 'es2020', // Align with tsconfig.json
      commonjsOptions: {  
        transformMixedEsModules: true,
        // Help resolve CJS/ESM interop issues
        include: [/node_modules/]
      },  
      rollupOptions: {  
        output: {  
          manualChunks(id) {  
            if (id.includes('node_modules')) {  
              return 'vendor';  
            }
            return undefined;
          }
        },
        // Careful handling of mixed modules
        preserveEntrySignatures: 'strict'
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

    // TypeScript Configuration - Enhanced for build errors
    esbuild: {
      logOverride: { 
        'this-is-undefined-in-esm': 'silent',
        'commonjs-variable-in-esm': 'silent'
      },
      // Add JSX factory configuration
      jsx: 'automatic',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment'
    },

    // Additional configuration for type checking
    define: {
      // Polyfills and environment variables
      'process.env': {},
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Ensure global Node.js variables are defined
      'global': {},
      '__dirname': JSON.stringify('/'),
      '__filename': JSON.stringify('index.js')
    }
  };
});
