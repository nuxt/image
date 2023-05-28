import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

// https://strapi-community.github.io/strapi-plugin-local-image-sharp/

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    resize: 'resize',
    fit: 'fit',
    position: 'positon',
    trim: 'trim',
    format: 'format',
    quality: 'quality',
    rotate: 'rotate',
    enlarge: 'enlarge',
    flip: 'flip',
    flop: 'flop',
    sharpen: 'sharpen',
    median: 'median',
    gamma: 'gamma',
    negate: 'negate',
    normalize: 'normalize',
    threshold: 'threshold',
    grayscale: 'grayscale',
    animated: 'animated'
  },
  joinWith: ',',
  formatter: (key, value) => `${key}_${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = 'http://localhost:1337/uploads' } = {}) => {
  const operations = operationsGenerator(modifiers as any)

  return {
    url: joinURL(baseURL, operations, src)
  }
}

export const validateDomains = true
