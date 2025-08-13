import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // กำหนดให้เซิร์ฟเวอร์รันบนพอร์ต 5173
    port: 5173, 
  }
})
