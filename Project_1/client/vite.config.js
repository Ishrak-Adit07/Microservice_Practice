import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/payment": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
      },
      "/download": {
        target: "http://localhost:8002",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})