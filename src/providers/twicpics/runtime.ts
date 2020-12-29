import type { ProviderGetImage } from 'src'
import { joinURL } from 'ufo'
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
    format: 'output',
    quality: 'quality',
    background: 'background'
  },
  valueMap: {
    format (value: string) {
      if (value === 'jpg') {
        return 'jpeg'
      }
      return value
    },
    background (value: string) {
      if (value.startsWith('#')) {
        return value.replace('#', '')
      }
      return value
    }
  },
  joinWith: '/',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const { width, height, fit, ...providerModifiers } = modifiers

  if (width || height) {
    providerModifiers[fits(fit)] = `${width || '-'}x${height || '-'}`
  }
  const operations = operationsGenerator(providerModifiers)
  const twicpicsOperations = (operations) ? '?twic=v1/' + operations : ''

  return {
    url: joinURL(baseURL, src + twicpicsOperations)
  }
}
