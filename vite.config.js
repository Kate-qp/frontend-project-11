import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        resolve(projectRoot),
        resolve(projectRoot, '..')
      ]
    }
  },
    proxy: {
      '/api': {
        target: 'https://allorigins.hexlet.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
      'bootstrap': resolve(dirname(fileURLToPath(import.meta.url)), 'node_modules/bootstrap')
    }
  }
})
