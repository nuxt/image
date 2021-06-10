import { expectFileToBeGenerated, expectFileNotToBeGenerated, setupTest } from '@nuxt/test-utils'

describe.skip('no config', () => {
  setupTest({
    generate: true,
    config: {
      target: 'static',
      image: {
        provider: 'static'
      }
    }
  })

  // TODO: test for generated/optimized files
  test('render index', () => {
    expectFileToBeGenerated('/_nuxt/image/cc1019.jpg')
    expectFileNotToBeGenerated('/2000px-Aconcagua2016.jpg')
  })
})
