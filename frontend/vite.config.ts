import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: "localhost", // Ensure this matches your hostname
        port: 5173,
    },
    plugins: [
      react(),
      tailwindcss()
    ],
})
