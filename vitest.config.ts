import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'src/__tests__/e2e/**'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/app/test/**', 'src/__tests__/e2e/**'],
      all: true,
    },
    pool: 'forks',
    isolate: true,
    passWithNoTests: true,
    bail: process.env.CI ? 1 : 0,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
