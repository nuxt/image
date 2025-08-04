import { joinURL } from 'ufo'
import { defineProvider } from '../../../../dist/runtime'

export default defineProvider<{ baseURL?: string }>({
  getImage: (src, { modifiers, baseURL = '/' }) => {
    const operationsString = `w_${modifiers.width}&h_${modifiers.height}`
    return {
      url: joinURL(baseURL, operationsString, src),
    }
  },
})
