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
      const images = await page.locator('img').all()

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

  it('preloads image with correct attributes', async () => {
    const page = await createPage()
    await page.goto(url('/img-preload'))

    const link1 = page.locator('head link[rel="preload"][as="image"][href="/_ipx/s_500x500/images/colors-no-densities-or-sizes-prop.jpg"]')
    expect(await link1.getAttribute('imagesizes')).toBeNull()
    expect(await link1.getAttribute('imagesrcset')).toBeNull()

    const link2 = page.locator('head link[rel="preload"][as="image"][href="/_ipx/s_1000x1000/images/colors-with-densities-and-no-sizes-prop.jpg"]')
    expect(await link2.getAttribute('imagesizes')).toBeNull()
    expect(await link2.getAttribute('imagesrcset')).not.toBeNull()

    const link3 = page.locator('head link[rel="preload"][as="image"][href="/_ipx/s_1000x1000/images/colors-with-densities-and-sizes-prop.jpg"]')
    expect(await link3.getAttribute('imagesizes')).not.toBeNull()
    expect(await link3.getAttribute('imagesrcset')).not.toBeNull()

    const link4 = page.locator('head link[rel="preload"][as="image"][href="/_ipx/s_1000x1000/images/colors-with-densities-sizes-and-fetchprio-prop.jpg"]')
    expect(await link4.getAttribute('imagesizes')).not.toBeNull()
    expect(await link4.getAttribute('imagesrcset')).not.toBeNull()
    expect(await link4.getAttribute('fetchpriority')).toBe('high')

    await page.close()
  })

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
})
