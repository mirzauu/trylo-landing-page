import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2018',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) return 'react';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@paddle')) return 'paddle';
            return 'vendor';
          }
        },
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    drop: ['console', 'debugger'],
  },
});
