import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
    },
  },
})
