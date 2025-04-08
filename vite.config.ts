
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
    },  
    
    // Resolve Aliases  
    resolve: {  
      alias: {  
        '@': path.resolve(__dirname, 'src'),  
      }  
    },  
    
    // Build Configuration  
    build: {  
      outDir: 'dist',  
      sourcemap: mode === 'development',  
      minify: mode === 'production',
    },  
  };
});
