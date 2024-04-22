import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { setup, createPage, url, fetch } from '@nuxt/test-utils'

import { providers } from '../../playground/providers'

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
    it(`${provider.name} should render images`, async () => {
      const providerPath = `/provider/${provider.name}`

      const page = await createPage()

      const requests: string[] = []
      await page.route('**', (route) => {
        requests.push(route.request().url())
        return route.continue()
      })

      await page.goto(url(providerPath))

      await page.waitForSelector('img')
      const images = await page.getByRole('img').all()

      expect(images).toHaveLength(provider.samples.length)

      const sources = await Promise.all(images.map(el => el.evaluate(e => e.getAttribute('src'))))
      expect(sources).toMatchSnapshot()

      expect(requests.map(r => r.replace(url('/'), '/')).filter(r => r !== providerPath && !r.match(/\.(js|css)/))).toMatchSnapshot()

      await page.close()
    })
  }

  it('should emit load and error events', async () => {
    const page = await createPage()
    const logs: string[] = []

    page.on('console', (msg) => { logs.push(msg.text()) })

    await page.goto(url('/events'))

    await page.waitForLoadState('networkidle')

    expect(logs.filter(log => log === 'Image was loaded').length).toBe(4)
    expect(logs.filter(log => log === 'Error loading image').length).toBe(2)

    await page.close()
  })

  it('works with runtime ipx', async () => {
    const res = await fetch(url('/_ipx/s_300x300/images/colors.jpg'))
    expect(res.headers.get('content-type')).toBe('image/jpeg')
  })
})
