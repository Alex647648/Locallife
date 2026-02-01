import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Proxy API requests to backend
          '/api': {
            target: env.VITE_API_BASE_URL || 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      // Removed API_KEY exposure - now handled by backend
      define: {
        // Only expose safe, non-sensitive environment variables
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
