import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/movies-app/',
  build: {
    outDir: '.', // <-- السطر ده هيخلي الملفات تطلع في الـ root بره علطول
  }
})