import { testComponent } from '../fixture/utils/img'
import Component from '~/src/runtime/nuxt-img'

describe('Renders simple image', () => {
  testComponent(Component, {
    width: 200,
    height: 200,
    sizes: '200,500:500,900:900'
  })
})
