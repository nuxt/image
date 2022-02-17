// https://unsplash.com/documentation#dynamically-resizable-images

import { joinURL, withBase } from 'ufo'
import { operationsGenerator } from './imgix'
import type { ProviderGetImage } from 'src'

const unsplashCDN = 'https://images.unsplash.com/'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = unsplashCDN } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: withBase(joinURL(src + (operations ? ('?' + operations) : '')), baseURL)
  }
}
