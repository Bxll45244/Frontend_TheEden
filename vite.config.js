import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // ส่วนที่เพิ่มเข้ามาเพื่อแก้ไข Rollup Error
  build: {
    rollupOptions: {
      external: [
        // เพิ่มโมดูล Font Awesome ที่ Rollup หาไม่เจอเข้าไปใน External List
        '@fortawesome/fontawesome-svg-core'
      ],
    },
  },
});