import { joinURL, hasProtocol } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'func',
    format: 'force_format',
    quality: 'q',
    width: 'w',
    height: 'h',
  },
  valueMap: {
    fit: {
      cover: 'crop',
      contain: 'fit',
      fill: 'cover',
      inside: 'bound',
      outside: 'boundmin',
    },
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export const getImage: ProviderGetImage = (src, {
  modifiers = {},
  baseURL = '',
} = {}) => {
  const operations = operationsGenerator(modifiers)
  const query = (operations ? ('?' + operations) : '')

  if (import.meta.dev) {
    if (!baseURL) {
      console.warn(`[fielrobot] <baseURL> is required to build image URL`)
    }
  }

  if (hasProtocol(src)) {
    return {
      url: joinURL(src) + query,
    }
  }

  return {
    url: joinURL(baseURL, src) + query,
  }
}
