import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environmentOptions: {
      nuxt: {
        overrides: {
          modules: ['@nuxt/image'],
        },
      },
    },
    coverage: {
      exclude: [
        '**virtual**',
        '**/.nuxt',
        'node_modules',
        'playground',
        'test',
      ],
    },
  },
})
