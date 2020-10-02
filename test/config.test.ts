import { setupTest } from '@nuxt/test-utils'

describe('undefined config', () => {
  setupTest({
    fixture: 'fixture/base',
    configFile: 'nuxt.config.ts',
    config: {}
  })

  test('render index', () => {
    expect(true).toBeTruthy()
  })
})

describe('Custome Provider', () => {
  setupTest({
    fixture: 'fixture/base',
    configFile: 'nuxt.config.ts',
    config: {
      image: {
        providers: {
          random: '~/providers/random'
        }
      }
    }
  })

  test('built', () => {
    expect(true).toBeTruthy()
  })
})
