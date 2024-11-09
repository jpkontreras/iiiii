import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import fs from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync('./nginx/certs/localhost-key.pem'),
            cert: fs.readFileSync('./nginx/certs/localhost.pem'),
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
});
