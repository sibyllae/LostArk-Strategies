import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const BASE = '/LostArk-Strategies/';

/** 開發／預覽時訪問根路徑 `/` 自動導向 `/LostArk-Strategies/` */
const redirectRootToBase = (): Plugin => {
  const redirectMiddleware: Parameters<NonNullable<Plugin['configureServer']>>[0]['middlewares']['use'] extends (
    fn: infer F
  ) => unknown
    ? F
    : never = (req, res, next) => {
    if (req.url === '/') {
      res.statusCode = 302;
      res.setHeader('Location', BASE);
      res.end();
      return;
    }
    next();
  };

  return {
    name: 'redirect-root-to-base',
    configureServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), redirectRootToBase()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
