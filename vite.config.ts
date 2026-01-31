import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-v72.js`,
        chunkFileNames: `assets/[name]-v72.js`,
        assetFileNames: `assets/[name]-v72.[ext]`
      }
    }
  }
})
