import type { RuntimeProviderGetImage } from 'src'
import { createMapper, createOperationsGenerator } from '@nuxt/image/runtime'

const fits = createMapper({
  fill: 'resize',
  inside: 'contain-max',
  outside: 'contain-min',
  cover: 'cover',
  contain: 'contain',
  missingValue: 'cover'
})

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'format',
    quality: 'quality',
    background: 'background'
  },
  valueMap: {
    format (value) {
      if (value === 'jpg') {
        return 'jpeg'
      }
      return value
    }
  },
  joinWith: '/',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: RuntimeProviderGetImage = (src, { modifiers, baseURL }) => {
  const { width, height, fit, ...providerModifiers } = modifiers

  if (width || height) {
    providerModifiers[fits(fit)] = `${width || '-'}x${height || '-'}`
  }
  const operations = operationsGenerator(providerModifiers)
  const twicpicsOperations = (operations) ? '?twic=v1/' + operations : ''

  return {
    url: baseURL + src + twicpicsOperations
  }
}
