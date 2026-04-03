import { encodeQueryItem, joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  joinWith: '&',
  formatter: (key, value) => encodeQueryItem(key, value),
})

interface GitHubOptions {
  baseURL?: string
}

export default defineProvider<GitHubOptions>({
  getImage: (src, { modifiers, baseURL = 'https://avatars.githubusercontent.com/' }) => {
    let size = 460 // Default size
    // Calculate size based on width/height
    const requestedSize = Math.max(modifiers?.height ?? 0, modifiers?.width ?? 0)
    if (requestedSize > 0) {
      size = Math.min(Math.max(1, requestedSize), 460)
    }

    const operations = operationsGenerator({
      v: 4,
      s: size,
    })

    return {
      url: joinURL(baseURL, src + '?' + operations),
    }
  },
})
