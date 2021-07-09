import { setupTest, createPage, url } from '@nuxt/test-utils'
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
    expect(body).toContain('/_ipx/s_300x200/2000px-Aconcagua2016.jpg')

    const positiveRequest = requests.find(request => request.match('/_ipx/s_300x200/2000px-Aconcagua2016.jpg'))
    expect(positiveRequest).toBeTruthy()
    const negativeRequest = requests.find(request => request.match('1280px-K2_2006b.jpg'))
    expect(negativeRequest).toBeFalsy()
  })

  test('change image location', async () => {
    await page.click('#button')
    const positiveRequest = requests.find(request => request.match('/_ipx/s_300x200/1280px-K2_2006b.jpg'))
    expect(positiveRequest).toBeTruthy()
  })
})
