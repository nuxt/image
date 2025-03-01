import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'cmpr',
    format: 'f',
    fit: 'm',
    passThrough: 'pass',
    sharpen: 's',
    rotate: 'r',
    screenPercent: 'pc',
    crop: 'cr',
    inline: 'in',
    metadata: 'meta',
    maxDpr: 'maxdpr',
    download: 'dl',
  },
  valueMap: {
    fit: {
      cover: 'cropbox',
      contain: 'letterbox',
      fill: 'stretch',
      inside: 'box',
      outside: 'box',
      productletterbox: 'productletterbox',
    },
    format: {
      jpeg: 'jpg',
    },
    quality(value: string) {
      // ImageEngine uses compression, which is the opposite of quality,
      // so quality 90 == compression 10.  Convert using: compression = 100 - quality
      let compression = (100 - Number.parseInt(value, 10))

      // ImageEngine's values are 0-99 (100 values), whereas Nuxt uses 0-100 (101 values)
      // so we clip the upper bound at 99 if 100 was requested.
      if (compression === 100) {
        compression = 99
      }
      return compression.toString()
    },
  },
  joinWith: '/',
  formatter: (key, value) => `${key}_${value}`,
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?imgeng=/' + operations) : '')),
  }
}
