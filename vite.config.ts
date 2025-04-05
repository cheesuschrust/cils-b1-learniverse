
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  server: {
    port: 8080,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@hookform/resolvers',
      'class-variance-authority',
      'clsx',
      'lucide-react'
    ],
    force: true
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}));
