import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, '../common'),
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
}); 