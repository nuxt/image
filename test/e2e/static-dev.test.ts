import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  dev: true,
  nuxtConfig: {
    nitro: {
      static: true,
    },
  },
})

describe('ipx in dev with nitro.static', () => {
  it('serves images', async () => {
    const res = await fetch('/_ipx/w_100/images/colors.jpg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/jpeg')
  })
})
