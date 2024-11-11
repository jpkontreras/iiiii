import react from '@vitejs/plugin-react';
import laravelTranslator from 'laravel-translator/vite';
import laravel from 'laravel-vite-plugin';
import fs from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',
    https: {
      key: fs.readFileSync('./.dev/nginx/certs/localhost-key.pem'),
      cert: fs.readFileSync('./.dev/nginx/certs/localhost.pem'),
    },
  },
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
    laravelTranslator(),
  ],
});
