import { testComponent } from '../fixture/utils/picture'
import Component from '~/src/runtime/nuxt-picture'

describe('Renders simple image', () => {
  testComponent(Component, {
    loading: 'lazy',
    width: 200,
    height: 200,
    sizes: '200,500:500,900:900'
  })
})

// describe('Renders loading=auto', () => {
//   testComponent(Component, {
//     loading: 'auto',
//     width: '200px',
//     height: 200,
//     sizes: [
//       {
//         width: 200
//       }, {
//         width: 500,
//         breakpoint: 500
//       }, {
//         width: 900,
//         breakpoint: 900
//       }
//     ]
//   })
// })

// describe('Renders noscript', () => {
//   testComponent(Component, {
//     loading: 'lazy',
//     noScript: true,
//     width: 200,
//     height: 200,
//     sizes: [
//       {
//         width: 200
//       }, {
//         width: 500,
//         breakpoint: 500
//       }, {
//         width: 900,
//         media: '(min-width: 900px)'
//       }
//     ]
//   })
// })
