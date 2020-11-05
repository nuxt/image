import { testComponent } from '../fixture/utils/componet'
import Component from '~/src/runtime/nuxt-picture'

describe('Renders simple image', () => {
  testComponent(Component, {
    lazy: true,
    width: 200,
    height: 200,
    sets: '200,500:500,900:900 (webp)'
  })
})

describe('Renders lazy=false', () => {
  testComponent(Component, {
    lazy: false,
    width: '200px',
    height: 200,
    sets: [
      {
        width: 200
      }, {
        width: 500,
        breakpoint: 500
      }, {
        width: 900,
        breakpoint: 900,
        format: 'webp'
      }
    ]
  })
})

describe('Renders noscript', () => {
  testComponent(Component, {
    lazy: true,
    noScript: true,
    width: 200,
    height: 200,
    sets: [
      {
        width: 200
      }, {
        width: 500,
        breakpoint: 500
      }, {
        width: 900,
        media: '(min-width: 900px)',
        format: 'webp'
      }
    ]
  })
})
