import { encodeQueryItem, joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    dpr: 'dpr',
    fit: 'fit',
    gravity: 'g',
    quality: 'q',
    format: 'f',
    sharpen: 'sharpen',
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'scale-down',
      outside: 'crop',
      inside: 'pad',
    },
    gravity: {
      auto: 'auto',
      side: 'side',
    },
  },
  joinWith: ',',
  formatter: (key, value) => encodeQueryItem(key, value),
})

const defaultModifiers = {}

interface CloudflareOptions {
  baseURL?: string
}

// https://developers.cloudflare.com/images/image-resizing/url-format/
export default defineProvider<CloudflareOptions>({
  getImage: (src, {
    modifiers,
    baseURL = '/',
  }) => {
    const mergeModifiers = { ...defaultModifiers, ...modifiers }
    const operations = operationsGenerator(mergeModifiers as any)

    // https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
    const url = operations ? joinURL(baseURL, 'cdn-cgi/image', operations, src) : src

    return {
      url,
    }
  },
})
