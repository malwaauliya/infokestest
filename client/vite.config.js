import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 3001,
    https: false,
    fs: {
      strict: true,
      deny: ['.env', '.env.*','.htaccess', '.htaccess.*', '*.{crt,pem}']
    }
  },
})
