import type { ProviderGetImage } from 'src'
import { withBase, joinURL, parseURL } from 'ufo'

// https://www.storyblok.com/docs/image-service
const storyblockCDN = 'https://img2.storyblok.com'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = storyblockCDN } = {}) => {
  const {
    fit,
    smart,
    width = '0',
    height = '0',
    filters = {},
    format,
    quality
  } = modifiers

  const doResize = width !== '0' || height !== '0'

  if (format) {
    filters.format = format + ''
  }

  if (quality) {
    filters.quality = quality + ''
  }

  const _filters = Object.entries(filters || {}).map(e => `${e[0]}(${e[1]})`).join(':')

  const options = joinURL(
    fit ? `fit-${fit}` : '',
    doResize ? `${width}x${height}` : '',
    smart ? 'smart' : '',
    _filters ? ('filters:' + _filters) : ''
  )

  // TODO: check if hostname is https://a.storyblok.com ?
  const { pathname } = parseURL(src)

  const url = withBase(joinURL(options, pathname), baseURL)

  return {
    url
  }
}
