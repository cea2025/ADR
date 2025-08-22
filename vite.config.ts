import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          pdf: ['jspdf', 'jspdf-autotable'],
          mobile: ['react-window', 'react-swipeable', '@use-gesture/react']
        }
      }
    },
    target: 'es2015', // תמיכה בדפדפני נייד ישנים
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true // הסרת console.log בproduction
      }
    }
  },
  define: {
    'process.env': {}
  }
})
