import { joinURL, hasProtocol } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'func',
    quality: 'q',
    format: 'force_format',
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

interface CloudimageOptions {
  token: string
  apiVersion?: string
  baseURL?: string
  cdnURL?: string
}

// https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/introduction
export default defineProvider<CloudimageOptions>({
  getImage: (src, {
    modifiers,
    baseURL,
    token = '',
    apiVersion = '',
    cdnURL = '',
  }) => {
    const operations = operationsGenerator(modifiers)
    const query = (operations ? ('?' + operations) : '')

    if (import.meta.dev) {
      const warning = []

      if (!token && !cdnURL) {
        warning.push('<token> or <cdnURL>')
      }

      if (warning.length > 0) {
        console.warn(`[cloudimage] ${warning.join(', ')} is required to build image URL`)
        return {
          url: joinURL('<token>', '<baseURL>', src) + query,
        }
      }
    }

    if (!cdnURL) {
      cdnURL = `https://${token}.cloudimg.io/${apiVersion}`
    }

    if (hasProtocol(src) || !baseURL) {
      return {
        url: joinURL(cdnURL, src) + query,
      }
    }

    return {
      url: joinURL(cdnURL, baseURL, src) + query,
    }
  },
})
