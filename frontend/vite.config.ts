import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import istanbul from "vite-plugin-istanbul"

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: "localhost", // Ensure this matches your hostname
        port: 5173,
    },
    plugins: [
      react(),
      tailwindcss(),
      istanbul({
          include: "src/*", // Specify directories to instrument
          exclude: ["node_modules", "test/*", "cypress/*"],
          extension: [".ts", ".tsx"], // Extensions to instrument
          cypress: true, // Enable coverage for Cypress
          forceBuildInstrument: true,
      })
    ],
})
