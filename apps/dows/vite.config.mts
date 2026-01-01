import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api/admin/project': {
            target: 'https://von-unremanded-oligopoly.ngrok-free.dev', // 家庆后端
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },

          /*
          '/api/admin/project': {
            target: 'http://localhost:18001', // 本地后端
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
          */

          '/api': {
            target: 'http://localhost:5320/api',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
    },
  };
});
