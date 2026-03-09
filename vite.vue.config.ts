import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  root: 'vue-entry',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src-vue'),
    },
  },
  server: {
    port: 5200,
  },
  build: {
    outDir: 'dist-vue',
    emptyOutDir: true,
  },
});
