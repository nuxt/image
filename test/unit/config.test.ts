import { setupTest } from '@nuxt/test-utils'

describe('undefined config', () => {
  setupTest({
    fixture: 'fixture/base',
    configFile: 'nuxt.config.ts',
    config: {}
  })

  test.todo('render index')
})

describe('Custom Provider', () => {
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

  test.todo('built')
})
