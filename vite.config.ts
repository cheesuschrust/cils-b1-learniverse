/// <reference types="vite/client" />  
import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import * as path from 'path';  

export default defineConfig(({ mode }) => ({  
  plugins: [  
    react(),  
    // Removed the componentTagger() as it was causing issues with Vite 6
  ],
  
  // Server Configuration  
  server: {  
    port: 8080,  
    host: true,  
    open: true, // Automatically open browser  
    strictPort: true, // Exit if port is in use  
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
      '@context': path.resolve(__dirname, 'src/context'),  
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
      // Removed 'shadcn-ui' as it's not actually a package
    ],  
    force: true  
  },  
  
  // Build Configuration  
  build: {  
    outDir: 'dist',  
    sourcemap: mode === 'development',  
    minify: mode === 'production',  
    commonjsOptions: {  
      transformMixedEsModules: true  
    },  
    rollupOptions: {  
      output: {  
        manualChunks(id) {  
          if (id.includes('node_modules')) {  
            return 'vendor';  
          }  
        }  
      }  
    }  
  },  
  
  // Testing Configuration  
  test: {  
    globals: true,  
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'], // Fixed path to look in tests folder
    coverage: {  
      provider: 'v8',  
      reporter: ['text', 'json', 'html']  
    }  
  }  
}));
