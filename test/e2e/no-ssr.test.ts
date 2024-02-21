import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils'

import { providers } from '../../playground/providers'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  browser: true,
  nuxtConfig: {
    ssr: false,
    image: {
      inject: false,
      provider: 'ipx'
    }
  }
})

describe('browser (ssr: false)', () => {
  for (const provider of providers) {
    it(`${provider.name} should render images`, async () => {
      const providerPath = `/provider/${provider.name}`

      const requests: string[] = []
      const page = await createPage()
      page.route('**', (route) => {
        requests.push(route.request().url())
        return route.continue()
      })
      page.goto(url(providerPath))

      await page.waitForSelector('img')
      const images = await page.getByRole('img').all()

      expect(images).toHaveLength(provider.samples.length)

      const sources = await Promise.all(images.map(el => el.evaluate(e => e.getAttribute('src'))))
      expect(sources).toMatchSnapshot()

      expect(requests.map(r => r.replace(url('/'), '/')).filter(r => r !== providerPath && !r.match(/\.(js|css)/))).toMatchSnapshot()
    })
  }

  it('should emit load and error events', async () => {
    const page = await createPage('/events')
    const logs: string[] = []

    page.on('console', (msg) => { logs.push(msg.text()) })

    await page.waitForLoadState('networkidle')

    expect(logs.filter(log => log === 'Image was loaded').length).toBe(4)
    expect(logs.filter(log => log === 'Error loading image').length).toBe(2)
  })
})
