import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const normalizeTarget = (value, fallback) => {
  const normalized = String(value || '').trim()
  if (!normalized) {
    return fallback
  }

  return normalized.replace(/\/$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const proxyTarget = normalizeTarget(env.VITE_DEV_PROXY_TARGET, 'http://localhost:8000')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
