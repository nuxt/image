import { setupTest } from '@nuxt/test-utils'

describe('undefined config', () => {
  setupTest({
    fixture: 'fixture/base',
    configFile: 'nuxt.config.ts',
    generate: true,
    server: true,
    config: {}
  })

  test('render index', () => {
    expect(true).toBeTruthy()
  })
})
