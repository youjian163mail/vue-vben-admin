import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api/admin/project/entity': {
            target: 'http://localhost:18001',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
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
