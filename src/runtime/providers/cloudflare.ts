import { encodeQueryItem, hasProtocol, joinURL } from 'ufo'
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
  /** Explicit app origin for cross-zone resolution (e.g. 'https://app.example.com'). */
  appOrigin?: string
}

function getRequestOrigin(event: unknown): string {
  const headers = (event as any)?.headers
  if (typeof headers?.get === 'function') {
    const forwardedHost = headers.get('x-forwarded-host')
    const host = (forwardedHost ? forwardedHost.split(',')[0].trim() : '') || headers.get('host')
    const proto = (headers.get('x-forwarded-proto') || 'https').split(',')[0].trim()
    if (host) return `${proto}://${host}`
  }
  if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
    return window.location.origin
  }
  return ''
}

// https://developers.cloudflare.com/images/transform-images/transform-via-url/
export default defineProvider<CloudflareOptions>({
  getImage: (src, { modifiers, baseURL = '/', appOrigin }, ctx) => {
    const mergeModifiers = { ...defaultModifiers, ...modifiers }
    const operations = operationsGenerator(mergeModifiers as any)

    const isExternal = hasProtocol(src)
    const sourcePath = isExternal ? src : joinURL(ctx.options.nuxt.baseURL, src)

    // Cross-zone: resolve relative src to absolute URL so Cloudflare fetches from the correct origin
    let imageSource = sourcePath
    if (!isExternal && hasProtocol(baseURL)) {
      const origin = appOrigin || getRequestOrigin(ctx.options.event)
      if (origin) {
        imageSource = joinURL(origin, sourcePath)
      }
      else {
        console.warn(
          `[nuxt-image] Cloudflare cross-zone: could not determine app origin for source "${sourcePath}". `
          + 'Set `appOrigin` in your Cloudflare provider options to fix this.',
        )
      }
    }

    const url = operations
      ? joinURL(baseURL, 'cdn-cgi/image', operations, imageSource)
      : sourcePath

    return { url }
  },
})
