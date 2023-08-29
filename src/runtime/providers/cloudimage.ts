import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'func',
    quality: 'q',
    format: 'force_format'
  },
  valueMap: {
    fit: {
      cover: 'crop',
      contain: 'fit',
      fill: 'cover',
      inside: 'bound',
      outside: 'boundmin'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

// https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/introduction
export const getImage: ProviderGetImage = (src, {
  modifiers = {},
  baseURL = '',
  token = 'demo',
  apiVersion = 'v7',
  cdnURL = ''
} = {}) => {
  const operations = operationsGenerator(modifiers)
  if (!cdnURL) {
    cdnURL = `https://${token}.cloudimg.io/${apiVersion}`
  }
  return {
    url: joinURL(cdnURL, baseURL, src) + (operations ? ('?' + operations) : '')
  }
}
