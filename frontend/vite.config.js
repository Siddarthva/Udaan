import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function manualChunks(id) {
  if (!id.includes('node_modules')) return

  // React core runtime
  if (id.includes('react-dom') || id.includes('react/') || id.match(/[/\\]react[/\\]/)) {
    return 'vendor-react'
  }
  // Routing
  if (id.includes('react-router')) {
    return 'vendor-router'
  }
  // Animation: framer-motion, GSAP, Lenis
  if (
    id.includes('framer-motion') ||
    id.includes('gsap') ||
    id.includes('@gsap') ||
    id.includes('lenis')
  ) {
    return 'vendor-animation'
  }
  // State management & data fetching
  if (id.includes('zustand') || id.includes('@tanstack')) {
    return 'vendor-state'
  }
  // Icon library (large tree-shaken set)
  if (id.includes('lucide-react')) {
    return 'vendor-icons'
  }
  // Remaining utility libs
  if (
    id.includes('axios') ||
    id.includes('react-hook-form') ||
    id.includes('react-hot-toast') ||
    id.includes('clsx') ||
    id.includes('tailwind-merge')
  ) {
    return 'vendor-utils'
  }
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
    // Raise the warning threshold slightly so only genuinely huge chunks surface
    chunkSizeWarningLimit: 600,
  },
})
