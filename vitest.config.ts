import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { src: fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/composables/useTodoFilter.ts',
        'src/composables/useValidation.ts',
        'src/stores/todoStore.ts',
        'src/utils/validation.ts',
        'src/utils/errorHandling.ts'
      ],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 }
    }
  }
})
