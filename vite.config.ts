import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-redirects',
        apply: 'build',
        generateBundle() {
          const redirectsPath = path.join(__dirname, 'public/_redirects');
          if (fs.existsSync(redirectsPath)) {
            const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
            this.emitFile({
              type: 'asset',
              fileName: '_redirects',
              source: redirectsContent,
            });
          }
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
