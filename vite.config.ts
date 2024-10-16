import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VantResolver } from '@vant/auto-import-resolver';

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), VantResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/assets/css/base.less";`
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true, // 自动启动浏览器
    host: '0.0.0.0', // localhost
    port: 8003, // 端口号
    proxy: {
      '/api': {
        target: 'https://www.cqredcross.org.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/videoapi': {
        target: 'https://www.cqredcross.org.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/videoapi/, '')
      }
    },
    hmr: {
      overlay: false
    }
  }
});
