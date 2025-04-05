import { getQuery, withBase, withQuery } from 'ufo'
import { operationsGenerator } from './imgix'
import unsplashProvider, { unsplashCDN } from './unsplash'
import { defineProvider } from '#image'

const prismicCDN = 'https://images.prismic.io/'

interface PrismicOptions {
  baseURL?: string
}

export default defineProvider<PrismicOptions>(() => {
  const { getImage: getUnsplashImage } = unsplashProvider()
  return {
    getImage: (src, { modifiers, baseURL = prismicCDN }, ctx) => {
      // Some images served by Prismic are from unsplash, so we use the unsplash provider for those
      if (src.startsWith(unsplashCDN)) {
        return getUnsplashImage(src, { modifiers }, ctx)
      }

      const operations = operationsGenerator(modifiers)
      // withQuery requires query parameters as an object, so I parse the modifiers into an object with getQuery
      return {
        url: withQuery(withBase(src, baseURL), getQuery('?' + operations)),
      }
    },

  }
})
