import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Set environment variables
  test: {
    env: {
      VITEST_ENV: 'true',
    },
  },
})
