import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Silent-Hill-Transcriber/',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Optimize for faster loading
        inlineDynamicImports: true
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting
    cssCodeSplit: false
  },
  // Optimize dev server
  server: {
    port: 3000,
    host: true
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})
