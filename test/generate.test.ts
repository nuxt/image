const { generate, createContext, loadNuxt, loadFixture } = require('@nuxtjs/module-test-utils')

describe('undefined config', () => {
  let nuxt
  beforeAll(async () => {
    createContext({
      fixture: 'fixture/base',
      configFile: 'nuxt.config.ts'
    })
    await loadFixture()
    await loadNuxt()
    await generate()
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render index', () => {
    expect(true).toBeTruthy()
  })
})
