import { setupTest } from '@nuxt/test-utils'

describe('undefined config', () => {
  setupTest({
    config: {}
  })

  test.todo('render index')
})

describe('Custom provider', () => {
  setupTest({
    config: {
      image: {
        providers: {
          random: {
            name: 'random',
            provider: '~/providers/random'
          }
        }
      }
    }
  })

  test.todo('built')
})
