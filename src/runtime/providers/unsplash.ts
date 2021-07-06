// https://unsplash.com/documentation#dynamically-resizable-images

import { joinURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { operationsGenerator } from './imgix'

const unsplashCDN = 'https://images.unsplash.com/'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = unsplashCDN } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(src.startsWith(baseURL) ? '' : baseURL, src + (operations ? ('?' + operations) : ''))
  }
}
