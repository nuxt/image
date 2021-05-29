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

// https://docs.netlify.com/large-media/transform-images/

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  if (modifiers.height || modifiers.width) {
    modifiers.fit = modifiers.fit || 'contain'
  }
  if (modifiers.format) {
    // Not currently supported
    delete modifiers.format
  }
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : ''))
  }
}
