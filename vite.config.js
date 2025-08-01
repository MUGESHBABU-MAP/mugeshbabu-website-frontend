import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'

  return {
    // base: isDev ? '/' : '/mugeshbabu-website-frontend/', // ✅ GitHub Pages base path only for production build
    base: '/',  // ✅ Always root for custom domain i.e mugeshbabu.com
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:6000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  }
})
