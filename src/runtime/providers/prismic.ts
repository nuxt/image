import { getQuery, withBase, withQuery } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { operationsGenerator } from './imgix'
import { getImage as getUnsplashImage, unsplashCDN } from './unsplash'

export const prismicCDN = 'https://images.prismic.io/'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = prismicCDN } = {}, ctx) => {
  // Some images served by Prismic are from unsplash, so we use the unsplash provider for those
  if (src.startsWith(unsplashCDN)) {
    return getUnsplashImage(src, { modifiers }, ctx)
  }

  const operations = operationsGenerator(modifiers)
  // withQuery requires query parameters as an object, so I parse the modifiers into an object with getQuery
  return {
    url: withQuery(withBase(src, baseURL), getQuery('?' + operations)),
  }
}
