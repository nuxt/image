import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { $fetch, setup, createPage, url, fetch } from '@nuxt/test-utils'

import { providers } from '../../playground/app/providers'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  browser: true,
  nuxtConfig: {
    image: {
      inject: false,
      provider: 'ipx',
    },
  },
})

describe('browser (ssr: true)', () => {
  for (const provider of providers) {
    it(`${provider.name} should render images`, { timeout: 20000 }, async () => {
      const providerPath = `/provider/${provider.name}`

      const page = await createPage()

      const requests: string[] = []
      await page.route('**', (route) => {
        requests.push(route.request().url())
        return route.continue()
      })

      await page.goto(url(providerPath), { waitUntil: 'networkidle' })

      await page.waitForSelector('img')
      const images = await page.getByRole('img').all()

      expect(images).toHaveLength(provider.samples.length)

      const sources = await Promise.all(images.map(el => el.evaluate(e => e.getAttribute('src'))))

      await expect({
        sources,
        requests: requests
          .map(r => r.replace(url('/'), '/')).filter(r => r !== providerPath && !r.match(/\.(js|css)/))
          .sort(),
      }).toMatchFileSnapshot(`./__snapshots__/${provider.name}.json5`)

      for (const source of sources) {
        if (source) {
          expect(() => decodeURIComponent(source)).not.toThrow()
        }
      }

      await page.close()
    })
  }

  it('should emit load and error events', async () => {
    const page = await createPage()
    const logs: string[] = []

    page.on('console', (msg) => {
      logs.push(msg.text())
    })

    await page.goto(url('/events'), { waitUntil: 'networkidle' })

    expect(logs.filter(log => log === 'Image was loaded').length).toBe(4)
    expect(logs.filter(log => log === 'Error loading image').length).toBe(2)

    await page.close()
  })

  it('works with runtime ipx', async () => {
    const res = await fetch(url('/_ipx/s_300x300/images/colors.jpg'))
    expect(res.headers.get('content-type')).toBe('image/jpeg')
  })

  it('works with server-side useImage', async () => {
    expect(await $fetch('/api/image' as any)).toMatchInlineSnapshot(`
      {
        "format": "webp",
        "url": "/_ipx/f_webp&q_75/image.jpg",
      }
    `)
  })

  it('should not load the main image twice when placeholder is enabled', async () => {
    const page = await createPage()

    const requests: string[] = []
    await page.route('**', (route) => {
      requests.push(route.request().url())
      return route.continue()
    })

    await page.goto(url('/placeholder-regression'), { waitUntil: 'networkidle' })

    await page.waitForSelector('img')

    const mainImageRequests = requests.filter(r =>
      r.includes('/_ipx/')
      && r.includes('images/colors.jpg')
      && r.includes('s_500x500'),
    )

    expect(mainImageRequests.length).toBe(1)

    await page.close()
  })
})
