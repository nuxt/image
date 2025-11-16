import { joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    quality: 'quality',
    format: 'format',
    fit: 'resize',
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'fill',
    },
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

interface SupabaseOptions {
  baseURL: string
}

export default defineProvider<SupabaseOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    if (!baseURL) {
      throw new Error('Supabase provider requires baseURL to be set')
    }

    const operations = operationsGenerator(modifiers)
    const operationsString = operations ? `?${operations}` : ''

    return {
      url: joinURL(baseURL, src + operationsString),
    }
  },
})
