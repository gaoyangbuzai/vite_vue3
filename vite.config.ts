import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './', // 设置打包目录
  server: {
    port: 4000,
    open: true,
    cors: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://58.87.122.140:8098',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(process.env.VUE_APP_BASE_API, '')
      }
    }
  }
})
