// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178, // 프론트 개발 서버 포트
    proxy: {
      // /api 로 시작하는 요청은 모두 백엔드(8080)으로 전달
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // /auth 로 시작하는 요청도 백엔드(8080)으로 전달
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
