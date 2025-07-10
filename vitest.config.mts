import { defineVitestProject } from '@nuxt/test-utils/config'
import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          exclude: ['test/nuxt/**', ...defaultExclude],
        },
      },
      defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**'],
          environmentOptions: {
            nuxt: {
              overrides: {
                modules: ['@nuxt/image'],
              },
            },
          },
        },
      }),
    ],
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
