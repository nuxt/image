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

const isDev = process.env.NODE_ENV === 'development'

// https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/introduction
export const getImage: ProviderGetImage = (src, {
  modifiers = {},
  baseURL = '',
  token = '',
  apiVersion = '',
  cdnURL = ''
} = {}) => {
  const operations = operationsGenerator(modifiers)
  if (!cdnURL) {
    cdnURL = `https://${token}.cloudimg.io/${apiVersion}`
  }

  if (isDev) {
    // eslint-disable-next-line
    console.warn('[cloudimage] <token> and <baseURL> has to be set to build image URL')
    return {
      url: joinURL('<token>', '<baseURL>', src) + (operations ? ('?' + operations) : '')
    }
  }

  return {
    url: joinURL(cdnURL, baseURL, src) + (operations ? ('?' + operations) : '')
  }
}
