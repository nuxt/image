import { joinURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    height: 'h',
    fit: 'nf_resize',
    width: 'w'
  },
  valueMap: {
    fit: {
      fill: 'smartcrop',
      contain: 'fit'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

const isDev = process.env.NODE_ENV === 'development'

// https://docs.netlify.com/large-media/transform-images/

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  if (modifiers.height || modifiers.width) {
    if (!(modifiers.height && modifiers.width)) {
      // smartcrop is only supported with both height and width
      modifiers.fit = 'contain'
      if (isDev) {
        // eslint-disable-next-line
        console.warn(`Reverting to fit=contain as smart cropping is only supported by providing both height and width. Warning originated from \`${src}\`.`)
      }
    } else {
      modifiers.fit = modifiers.fit || 'contain'
    }
  }
  if (modifiers.format) {
    // Not currently supported
    delete modifiers.format
    if (isDev) {
      // eslint-disable-next-line
      console.warn(`Providing format is not currently supported by the Netlify provider. Warning originated from \`${src}\`.`)
    }
  }
  if (isDev) {
    return { url: src }
  }
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : ''))
  }
}
