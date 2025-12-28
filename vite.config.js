import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  resolve: {
    alias: [
      { find: '/src', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  plugins: [react()],
  server: {
    fs: {
      allow: [path.resolve(__dirname)]
    },
    watch: {
      // Use polling to avoid EISDIR errors on some network/mapped drives
      usePolling: true
    }
  }
})
