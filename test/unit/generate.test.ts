import { setupTest } from '@nuxt/test-utils'

describe('undefined config', () => {
  setupTest({
    generate: true,
    config: {}
  })

  test.todo('render index')
})
