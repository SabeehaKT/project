import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This ensures correct MIME types
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
})
