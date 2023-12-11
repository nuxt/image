import { defineVitestConfig } from '@nuxt/test-utils/config'

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
