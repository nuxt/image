import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    coverage: {
      exclude: [
        '**/.nuxt',
        'node_modules',
        'playground',
        'test'
      ]
    }
  }
})
