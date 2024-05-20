// https://unsplash.com/documentation#dynamically-resizable-images

import { getQuery, withBase, withQuery } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { operationsGenerator } from './imgix'

const unsplashCDN = 'https://images.unsplash.com/'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = unsplashCDN } = {}) => {
  const operations = operationsGenerator(modifiers)
  // withQuery requires query parameters as an object, so I parse the modifiers into an object with getQuery
  return {
    url: withQuery(withBase(src, baseURL), getQuery('?' + operations)),
  }
}
