import { setupTest, createPage, url } from '@nuxt/test-utils'

describe('browser', () => {
  setupTest({
    fixture: 'fixture/base',
    configFile: 'nuxt.config.ts',
    config: {
      ssr: false
    },
    browser: true
  })
  let page
  const requests = []

  test('should render image', async () => {
    page = await createPage()
    page.route('**', (route) => {
      requests.push(route.request().url())
      return route.continue()
    })
    page.goto(url('/'))
    const body = await page.innerHTML('body')
    expect(body).not.toContain('/_/w_30/2000px-Aconcagua2016.jpg')
    const placeholderRequest = requests.find(request => request.match('/_image/ipx/_/w_30/2000px-Aconcagua2016.jpg'))
    expect(placeholderRequest).not.toBeNull()
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
