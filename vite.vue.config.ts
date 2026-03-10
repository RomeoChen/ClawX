import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

const projectRoot = __dirname;

export default defineConfig({
  root: resolve(projectRoot, 'vue-entry'),
  plugins: [
    vue(),
    electron([
      {
        entry: resolve(projectRoot, 'electron/main/index.ts'),
        onstart(options) {
          options.startup();
        },
        vite: {
          build: {
            outDir: resolve(projectRoot, 'dist-electron/main'),
            rollupOptions: {
              external: ['electron', 'electron-store', 'electron-updater', 'ws'],
            },
          },
        },
      },
      {
        entry: resolve(projectRoot, 'electron/preload/index.ts'),
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: resolve(projectRoot, 'dist-electron/preload'),
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src-vue'),
      '/src-vue': resolve(projectRoot, 'src-vue'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: resolve(projectRoot, 'dist-vue'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(projectRoot, 'vue-entry/index.html'),
    },
  },
});
