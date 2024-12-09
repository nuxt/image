import { withBase } from 'ufo'
import type { ProviderGetImage, ResolvedImage, ImageOptions } from '../../module'

export const getImage: ProviderGetImage = (
  src: string,
  { modifiers, baseURL = 'http://localhost:1337/uploads' }: ImageOptions = {},
): ResolvedImage => {
  const breakpoint = modifiers?.breakpoint
  const breakpoints = modifiers?.breakpoints || [
    'large',
    'medium',
    'small',
    'thumbnail',
  ]
  const formats = modifiers?.formats
  const path = src.replace(/^\/uploads\//, '')

  if (!breakpoint || !formats) {
    return {
      url: withBase(path, baseURL),
    }
  }

  const startIndex = breakpoints.indexOf(breakpoint)
  for (const size of breakpoints.slice(startIndex)) {
    const format = formats[size as (typeof breakpoints)[number]]

    if (format?.url) {
      const formatPath = format.url.replace(/^\/uploads\//, '')

      return {
        url: withBase(formatPath, baseURL),
      }
    }
  }

  return {
    url: withBase(path, baseURL),
  }
}
