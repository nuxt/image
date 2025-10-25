import { encodeQueryItem, joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import type { ProviderGetImage } from '@nuxt/image'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  joinWith: '&',
  formatter: (key, value) => encodeQueryItem(key, value),
})

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = 'https://avatars.githubusercontent.com/' }) => {
  let size = 460 // Default size
  // Calculate size based on width/height
  if (modifiers?.width || modifiers?.height) {
    size = Math.max(modifiers?.height ?? 0, modifiers?.width ?? 0)
  }

  const operations = operationsGenerator({
    v: 4,
    s: size,
  })

  return {
    url: joinURL(baseURL, src + '?' + operations),
  }
}

export default defineProvider({ getImage })
