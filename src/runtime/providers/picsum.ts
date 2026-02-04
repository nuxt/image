// https://picsum.photos/ - Lorem Picsum placeholder images

import { joinURL, withQuery } from 'ufo'
import { defineProvider } from '../utils/provider'

interface PicsumModifiers {
  grayscale?: boolean
  blur?: number
}

interface PicsumOptions {
  baseURL?: string
  modifiers?: PicsumModifiers
}

export const picsumCDN = 'https://picsum.photos/'

export default defineProvider<PicsumOptions>({
  getImage: (src, { modifiers, baseURL = picsumCDN }) => {
    const { width, height, grayscale, blur, ...otherModifiers } = modifiers || {}

    // Build the path
    // Picsum URL format: https://picsum.photos/[id/{id}/]{width}[/{height}]
    // Examples:
    //   - Random: https://picsum.photos/200/300
    //   - Specific ID: https://picsum.photos/id/237/200/300
    //   - Square: https://picsum.photos/200

    const parts: string[] = []

    // If src is provided and not empty, it could be:
    // - "id/237" for a specific image
    // - "seed/picsum" for a seeded image
    if (src && src !== '/') {
      const cleanSrc = src.startsWith('/') ? src.slice(1) : src
      if (cleanSrc) {
        parts.push(cleanSrc)
      }
    }

    // Add dimensions - these come after the ID/seed path
    if (width) {
      parts.push(String(width))
    }
    if (height) {
      parts.push(String(height))
    }

    // Build query parameters for modifiers
    const query: Record<string, string | number> = {}

    if (grayscale) {
      query.grayscale = ''
    }

    if (blur !== undefined && blur > 0) {
      // Picsum blur accepts values from 1-10
      query.blur = Math.min(Math.max(Math.round(blur), 1), 10)
    }

    // Add any other custom modifiers (excluding standard ones that don't apply to picsum)
    for (const [key, value] of Object.entries(otherModifiers)) {
      if (value !== undefined && value !== null && !['fit', 'format', 'quality', 'background'].includes(key)) {
        query[key] = value as string | number
      }
    }

    const url = joinURL(baseURL, ...parts)

    return {
      url: Object.keys(query).length > 0 ? withQuery(url, query) : url,
    }
  },
})
