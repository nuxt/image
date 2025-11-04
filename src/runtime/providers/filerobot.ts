import { joinURL, hasProtocol } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'func',
    format: 'force_format',
    quality: 'q',
    width: 'w',
    height: 'h',
  },
  valueMap: {
    fit: {
      cover: 'crop',
      contain: 'fit',
      fill: 'cover',
      inside: 'bound',
      outside: 'boundmin',
    },
  },
})

interface FilerobotOptions {
  baseURL: string
}

export default defineProvider<FilerobotOptions>({
  getImage: (src, {
    modifiers,
    baseURL = '',
  }) => {
    const operations = operationsGenerator(modifiers)
    const query = (operations ? ('?' + operations) : '')

    if (import.meta.dev) {
      if (!baseURL) {
        console.warn(`[fielrobot] <baseURL> is required to build image URL`)
      }
    }

    if (hasProtocol(src)) {
      return {
        url: joinURL(src) + query,
      }
    }

    return {
      url: joinURL(baseURL, src) + query,
    }
  },
})
