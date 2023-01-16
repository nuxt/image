// https://unsplash.com/documentation#dynamically-resizable-images

import { joinURL, withBase } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { operationsGenerator } from './imgix'

const unsplashCDN = 'https://images.unsplash.com/'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = unsplashCDN } = {}) => {
  const operations = operationsGenerator(modifiers)
  const hasQueryParams = src.includes('?')
  return {
    url: withBase(joinURL(src + (operations ? ((hasQueryParams ? '&' : '?') + operations) : '')), baseURL)
  }
}
