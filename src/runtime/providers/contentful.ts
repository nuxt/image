import { withBase, parseURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

// https://www.contentful.com/developers/docs/references/images-api/
const contentfulCDN = 'https://images.ctfassets.net'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'fm',
    width: 'w',
    height: 'h',
    focus: 'f',
    radius: 'r',
    quality: 'q',
    background: 'bg'
  },
  valueMap: {
    format: {
      jpeg: 'jpg'
    },
    fit: {
      cover: 'crop',
      contain: 'fill',
      fill: 'scale',
      thumbnail: 'thumb'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = contentfulCDN } = {}) => {
  const operations = operationsGenerator(modifiers)

  const { pathname } = parseURL(src)
  const path = pathname + (operations ? ('?' + operations) : '')
  const url = withBase(path, baseURL)

  return {
    url
  }
}
