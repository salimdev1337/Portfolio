import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/', // GitHub Pages base path
  server: {
    watch: {
      // Exclude the Python backend from Vite's file watcher.
      // Without this, Vite tries to watch thousands of files inside
      // backend/.venv/ (sentence-transformers, NLTK, etc.) and hits
      // the Linux inotify watcher limit (ENOSPC error).
      ignored: ['**/backend/**'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.{js,jsx}'
      ],
      exclude: [
        'node_modules/**',
        'coverage/**',
        'dist/**',
        'src/tests/**',
        '**/*.test.{js,jsx}',
        'src/main.jsx',
        '*.config.js',
        // Exclude components without tests
        'src/App.jsx',
        'src/sections/Hero.jsx',
        'src/sections/About.jsx',
        'src/sections/Contact.jsx',
        'src/sections/Skills.jsx',
        'src/sections/LoadingScreen.jsx',
        'src/sections/index.js',
        'src/components/common/Textarea.jsx',
        'src/components/common/RatingModal.jsx',
        'src/components/layout/Footer.jsx',
        'src/components/layout/index.js',
        // SSE streaming hook — requires integration tests, not unit tests
        'src/utils/useChatbot.js',
        // Barrel re-export, no logic to test
        'src/components/chatbot/index.js'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
})
