import type { ProviderGetImage } from 'src'
import { withBase, joinURL, parseURL } from 'ufo'

// https://www.storyblok.com/docs/image-service
const storyblockCDN = 'https://img2.storyblok.com'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = storyblockCDN } = {}) => {
  const { fit, smart, width, height, filters } = modifiers

  const doResize = width && height

  const options = joinURL(
    fit && `fit-${fit}`,
    doResize && `${width}x${height}`,
    smart && 'smart',
    filters && ('filters' + Object.entries(filters).map(e => `:${e[0]}(${e[1]})`).join(''))
  )

  // TODO: check if hostname is https://a.storyblok.com ?
  const { pathname } = parseURL(src)

  const url = withBase(joinURL(options, pathname), baseURL)

  return {
    url
  }
}
