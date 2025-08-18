import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    open: false // Don't auto-open browser
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  // Add error handling
  define: {
    global: 'globalThis',
  },
  // Ensure proper module resolution
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});