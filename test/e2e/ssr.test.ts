import { setupTest, createPage, get, url } from '@nuxt/test-utils'
import type { Page } from 'playwright'

describe('browser (ssr: true)', () => {
  setupTest({
    browser: true,
    config: {
      image: {
        provider: 'ipx'
      }
    }
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
    const body = await page.innerHTML('body')
    expect(body).toContain('/_ipx/2000px-Aconcagua2016.jpg?s=300_20')

    const positiveRequest = requests.find(request => request.match('/_ipx/2000px-Aconcagua2016.jpg'))
    expect(positiveRequest).toBeTruthy()
    const negativeRequest = requests.find(request => request.match('1280px-K2_2006b.jpg'))
    expect(negativeRequest).toBeFalsy()
  })

  test.skip('change image location', async () => {
    await page.click('#button')
    const positiveRequest = requests.find(request => request.match('/_ipx/1280px-K2_2006b.jpg'))
    expect(positiveRequest).toBeTruthy()
  })

  test('should opt for native lazy loading', async () => {
    // Ensures <img> tag is wrapped with <noscript>
    const response = await get('/lazy')
    expect(response.body).toContain('<noscript><img')
    expect(response.body).toContain('lazy.jpg')

    // Ensures our injected script replaces <noscript>
    page.goto(url('/lazy'))
    const body = await page.innerHTML('body')
    expect(body).not.toContain('<noscript>')
    expect(body).toContain('src="/_ipx/lazy.jpg?s=300_200"')
  })
})
