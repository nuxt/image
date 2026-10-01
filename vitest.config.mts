import { defineVitestProject } from '@nuxt/test-utils/config'
import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          // test/bun runs under `bun test`
          exclude: ['test/nuxt/**', 'test/e2e/**', 'test/bun/**', ...defaultExclude],
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
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.test.ts'],
          retry: 3,
        },
      },
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
