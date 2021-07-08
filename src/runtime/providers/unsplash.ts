// https://unsplash.com/documentation#dynamically-resizable-images

import { joinURL, withBase } from 'ufo'
import type { ProviderGetImage } from 'src'
import { operationsGenerator } from './imgix'

const unsplashCDN = 'https://images.unsplash.com/'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = unsplashCDN } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: withBase(joinURL(src + (operations ? ('?' + operations) : '')), baseURL)
  }
}
