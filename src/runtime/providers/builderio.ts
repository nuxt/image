import { encodeQueryItem, getQuery, withQuery } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

/**
 * Doc: https://www.builder.io/c/docs/image-api
 */
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    quality: 'quality',
    height: 'height',
    width: 'width',
    format: 'format',
    fit: 'fit',
    position: 'position',
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'fill',
      outside: 'outside',
      inside: 'inside',
    },
    position: {
      top: 'top',
      rightTop: 'right top',
      right: 'right',
      rightBottom: 'right bottom',
      bottom: 'bottom',
      leftBottom: 'left bottom',
      left: 'left',
      leftTop: 'left top',
      center: 'center',
    },
    format: {
      webp: 'webp',
      jpg: 'jpg',
      jpeg: 'jpeg',
      png: 'png',
      gif: 'gif',
      original: 'original',
    },
  },
  joinWith: '&',
  formatter: (key, value) => encodeQueryItem(key, value),
})

export default defineProvider({
  getImage(src, { modifiers }) {
    const operations = operationsGenerator(modifiers)

    return {
      url: withQuery(src, getQuery('?' + operations)),
    }
  },
})
