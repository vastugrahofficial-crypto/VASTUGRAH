import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { astrologyApiMiddleware } from './server/astroProxy.js'

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '')

  // Ensure FREE_ASTRO_API_KEY is available server-side in Node process
  if (env.FREE_ASTRO_API_KEY) {
    process.env.FREE_ASTRO_API_KEY = env.FREE_ASTRO_API_KEY
  }

  return {
    plugins: [
      react(),
      {
        name: 'freeastro-api-server',
        configureServer(server) {
          server.middlewares.use(astrologyApiMiddleware)
        },
        configurePreviewServer(server) {
          server.middlewares.use(astrologyApiMiddleware)
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: false,
    },
  }
})
