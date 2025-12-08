// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    proxy: {
      // 일반 REST API → /api로 시작
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // /api 접두어 그대로 유지
        rewrite: (path) => path,
      },

      // 로그인/회원가입 등 인증 API → /auth 로 시작
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // /auth 접두어 그대로 유지
        // rewrite 필요 없음
      },
    },
  },
});
