import Component from '../src/runtime/nuxt-image'
import { testComponent } from './fixture/utils/componet'

describe('Renders simple image', () => {
  testComponent(Component, {
    width: 200,
    height: 200,
    sets: '200,500:500,900:900 (webp)'
  })
})

describe('Renders legacy image', () => {
  testComponent(Component, {
    legacy: true,
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
