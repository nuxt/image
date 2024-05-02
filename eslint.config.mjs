// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
      './docs',
      './example',
    ],
  },
}).append(
  {
    files: ['test/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-invalid-void-type': 'off',
      // TODO: remove this rule
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
