// https://developers.cloudflare.com/images/url-format

import defu from 'defu'
import { ProviderGetImage } from 'src'
import { joinURL, encodeQueryItem, encodePath } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    dpr: 'dpr',
    fit: 'fit',
    gravity: 'g',
    quality: 'q',
    format: 'f',
    sharpen: 'sharpen'
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'scale-down',
      outside: 'crop',
      inside: 'pad'
    },
    gravity: {
      auto: 'auto',
      side: 'side'
    }
  },
  joinWith: ',',
  formatter: (key, val) => encodeQueryItem(key, val)
})

const defaultModifiers = {
  format: 'auto',
  quality: 'auto'
}

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const mergeModifiers = defu(modifiers, defaultModifiers)
  const operations = operationsGenerator(mergeModifiers as any)

  return {
    url: joinURL(baseURL, encodePath(src), operations)
  }
}
