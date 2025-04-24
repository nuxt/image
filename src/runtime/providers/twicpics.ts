import { encodeQueryItem, joinURL } from 'ufo'
import { defineProvider, createMapper, createOperationsGenerator } from '#image'
import type { InferModifiers } from '#image/utils/index'

const fits = createMapper({
  fill: 'resize',
  inside: 'contain',
  outside: 'contain',
  cover: 'cover',
  contain: 'inside',
  missingValue: 'cover',
} as const)

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'output',
    quality: 'quality',
    background: 'background',
    focus: 'focus',
    zoom: 'zoom',
  },
  valueMap: {
    format(value: string) {
      if (value === 'jpg') {
        return 'jpeg'
      }
      return value
    },
    background(value: string) {
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
      center: '50px50p',
    },
  },
  joinWith: '/',
  formatter: (key: 'output' | 'format' | 'fit' | 'quality' | 'background' | 'focus' | 'zoom', value) => encodeQueryItem(key, value),
} as const)

interface TwicpicsOptions {
  baseURL?: string
  modifiers?: InferModifiers<typeof operationsGenerator>
    & { fit?: 'fill' | 'inside' | 'outside' | 'cover' | 'contain' }
    & Partial<Record<'resize' | 'fill' | 'contain' | 'inside' | 'outside' | 'cover' | 'missingValue', string>>
    & Partial<Record<typeof fits extends (fit: string) => infer Fit ? NonNullable<Fit> : string, string>>
}

export default defineProvider<TwicpicsOptions>({
  getImage: (src, { modifiers, baseURL = '/' }) => {
    const { width, height, fit, ...providerModifiers } = modifiers

    let w = width
    let h = height

    if (width || height) {
      if (fit && fit === 'outside') {
      // fit = outside is equivalent to twicPics contain ( max( width, height ) x max( width, height ) )
        w = Math.max(width || 0, height || 0)
        h = Math.max(width || 0, height || 0)
      }
      providerModifiers[fits(fit as keyof typeof fits)] = `${w || '-'}x${h || '-'}`
    }

    const operations = operationsGenerator(providerModifiers)

    return {
      url: joinURL(baseURL, src + (operations ? ('?twic=v1/' + operations) : '')),
    }
  },
})
