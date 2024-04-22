import { encodeQueryItem, joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    height: 'h',
    fit: 'nf_resize',
    width: 'w',
  },
  valueMap: {
    fit: {
      fill: 'smartcrop',
      contain: 'fit',
    },
  },
  joinWith: '&',
  formatter: (key, value) => encodeQueryItem(key, value),
})

const isDev = process.env.NODE_ENV === 'development'

// https://docs.netlify.com/large-media/transform-images/

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  if (modifiers.format) {
    // Not currently supported
    delete modifiers.format
  }
  const hasTransformation = modifiers.height || modifiers.width
  if (!modifiers.fit && hasTransformation) {
    // fit is required for resizing images
    modifiers.fit = 'contain'
  }
  if (hasTransformation && modifiers.fit !== 'contain' && !(modifiers.height && modifiers.width)) {
    // smartcrop is only supported with both height and width
    if (isDev) {
      console.warn(`Defaulting to fit=contain as smart cropping is only supported when providing both height and width. Warning originated from \`${src}\`.`)
    }
    modifiers.fit = 'contain'
  }
  if (isDev) {
    return { url: src }
  }
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
  }
}
