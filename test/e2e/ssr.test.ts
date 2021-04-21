import { setupTest, createPage, url } from '@nuxt/test-utils'
import type { Page } from 'playwright'

describe('browser', () => {
  setupTest({
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
    // temporarily commented
    // const body = await page.innerHTML('body')
    // expect(body).toContain('/_image/local/local/_/w_30/2000px-Aconcagua2016.jpg')
    const positiveRequest = requests.find(request => request.match('2000px-Aconcagua2016.jpg'))
    expect(positiveRequest).not.toBeNull()
    const negativeRequest = requests.find(request => request.match('1280px-K2_2006b.jpg'))
    expect(negativeRequest).toBeUndefined()
  })
  test('change image location', async () => {
    await page.click('#button')
    const positiveRequest = requests.find(request => request.match('1280px-K2_2006b.jpg'))
    expect(positiveRequest).not.toBeUndefined()
  })
})
