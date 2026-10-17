import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  browser: true,
  nuxtConfig: {
    image: {
      inject: false,
      provider: 'ipx',
      preconnect: false,
    },
  },
})

describe('browser (ssr: true, preconnect: false)', () => {
  it('does not preconnect to remote provider origins when disabled', async () => {
    const page = await createPage()
    await page.goto(url('/provider/cloudinary'))
    await page.waitForSelector('img')

    const origins = await page.$$eval('head link[rel="preconnect"]', links => links.map(link => link.getAttribute('href')))

    expect(origins).toEqual([])

    await page.close()
  })
})
