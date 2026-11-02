import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { fetch, setup, url } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../fixtures/ipx-optin', import.meta.url)),
  build: true,
})

describe('ipx unsafeAllowedLoaders', () => {
  it('decodes TIFF input when opted in', async () => {
    const res = await fetch(url('/_ipx/w_32/images/benign.tif'))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('image/')
  })
})
