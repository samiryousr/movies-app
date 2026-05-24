import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // السطر ده مهم

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // التفعيل هنا
  ],
})