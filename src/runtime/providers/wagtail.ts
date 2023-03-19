import { withBase, joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'

// https://docs.wagtail.org/en/v4.2.1/topics/images.html

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  const {
    width = '0',
    height = '0',
    focusZoom = '0',
    format = 'webp',
    quality = '70'
  } = modifiers

  const doFill = width !== '0' && height !== '0'
  const doWidth = width !== '0' && height === '0'
  const doHeight = width === '0' && height !== '0'
  const doOriginal = width === '0' && height === '0'

  const fomatting = `|format-${format}|${format}quality-${quality}`
  const options = joinURL(
    doFill ? `fill-${width}x${height}-c${focusZoom}${fomatting}` : '',
    doWidth ? `width-${width}${fomatting}` : '',
    doHeight ? `height-${height}${fomatting}` : '',
    doOriginal ? `original${fomatting}` : ''
  )

  const url = withBase(joinURL(src, options), baseURL)
  return {
    url
  }
}
