import { joinURL } from 'ufo'
// this should normally be imported from '@nuxt/image/runtime'
// but we want to run this without building the package,
// which means supporting the stubbed `.ts` extension
import { defineProvider } from '../../../../dist/runtime'

export default defineProvider<{ baseURL?: string }>({
  getImage: (src, { modifiers, baseURL = '/' }) => {
    const operationsString = `w_${modifiers.width}&h_${modifiers.height}`
    return {
      url: joinURL(baseURL, operationsString, src),
    }
  },
})
