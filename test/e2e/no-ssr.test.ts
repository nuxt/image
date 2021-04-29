import { setupTest, createPage, url } from '@nuxt/test-utils'
import type { Page } from 'playwright'

describe('browser (ssr: false)', () => {
  setupTest({
    config: {
      ssr: false,
      image: {
        provider: 'ipx'
      }
    },
    browser: true
  })
  let page: Page
  const requests: string[] = []

  test('should render image', async () => {
    page = await createPage()

    page.route('**', (route) => {
      requests.push(route.request().url())
      return route.continue()
    })

    page.goto(url('/'))
    await page.waitForEvent('domcontentloaded')
    const body = await page.innerHTML('body')
    expect(body).toContain('/_ipx/2000px-Aconcagua2016.jpg?s=300_20')

    const positiveRequest = requests.find(request => request.match('/_ipx/2000px-Aconcagua2016.jpg'))
    expect(positiveRequest).toBeTruthy()
    const negativeRequest = requests.find(request => request.match('1280px-K2_2006b.jpg'))
    expect(negativeRequest).toBeFalsy()
  })

  test('change image location', async () => {
    await page.click('#button')
    const positiveRequest = requests.find(request => request.match('/_ipx/1280px-K2_2006b.jpg'))
    expect(positiveRequest).toBeTruthy()
  })

  test('should opt for native lazy loading', async () => {
    // Ensures we properly render image sources
    page.goto(url('/lazy'))
    await page.waitForEvent('domcontentloaded')
    const body = await page.innerHTML('body')
    expect(body).toContain('src="/_ipx/lazy.jpg?s=300_200"')
  })
})
