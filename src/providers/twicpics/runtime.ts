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
    background: 'background',
    focus: 'focus',
    zoom: 'zoom'
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
    },
    focus: {
      auto: 'auto',
      faces: 'faces',
      north: '50px0p',
      northEast: '100px0p',
      northWest: '0px0p',
      west: '0px50p',
      southWest: '100px100p',
      south: '50px100p',
      southEast: '0px100p',
      east: '100px50p',
      center: '50px50p'
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
  return {
    url: joinURL(baseURL, src + (operations ? ('?twic=v1/' + operations) : ''))
  }
}
