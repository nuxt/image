import { joinURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

const domain = 'cloudimg.io'
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

export const getImage: ProviderGetImage = (src, {
  modifiers = {}, baseURL = '',
  token = 'demo', apiVersion = 'v7', doNotReplaceURL = false
} = {}) => {
  const operations = operationsGenerator(modifiers)
  const finalDomain = token + '.' + domain
  const finalUrl = doNotReplaceURL ? baseURL : `https://${finalDomain}/${apiVersion}/${baseURL}`

  return {
    url: joinURL(finalUrl, src + (operations ? ('?' + operations) : ''))
  }
}
