// https://unsplash.com/documentation#dynamically-resizable-images

import { getQuery, withBase, withQuery } from 'ufo'
import { defineProvider } from '../provider'
import { operationsGenerator } from './imgix'

export const unsplashCDN = 'https://images.unsplash.com/'

interface UnsplashOptions {
  baseURL?: string
}

export default defineProvider<UnsplashOptions>({
  getImage: (src, { modifiers, baseURL = unsplashCDN }) => {
    const operations = operationsGenerator(modifiers)
    // withQuery requires query parameters as an object, so I parse the modifiers into an object with getQuery
    return {
      url: withQuery(withBase(src, baseURL), getQuery('?' + operations)),
    }
  },
})
