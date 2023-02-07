/**
 * Image provider for Uploadcare
 * URL API reference:
 * @link https://uploadcare.com/api-refs/url-api/
 *
 * URL format: https://ucarecdn.com/:uuid/-/:operation/:params/:filename
 *
 * Operations:
 * [ ] Image Compression
 * [ ] Image Geometry
 * [ ] Image Overlays
 * [ ] Image Colours
 * [ ] Image Definition
 * [ ] Image Rotations
 *
 * Other stuff to think about later:
 * - Signed URLs
 * - File Groups
 * - Custom CNAME: https://uploadcare.com/docs/delivery/cdn/#custom-cdn-cname
 *  */

import { joinURL } from 'ufo'
import { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  joinWith: '',
  formatter: (key, value) => `-/${key}/${value}/`
})

export const getImage: ProviderGetImage = (
  uuid,
  { modifiers, cdnURL = '' } = {}
) => {
  // If width or height is specified, use smart_resize instead
  if (modifiers?.width || modifiers?.height) {
    if (modifiers?.width && modifiers?.height) {
      modifiers.smart_resize = `${modifiers.width}x${modifiers.height}`
    } else if (modifiers?.width) {
      modifiers.resize = `${modifiers.width}x`
    } else if (modifiers?.height) {
      modifiers.resize = `x${modifiers.height}`
    }

    delete modifiers.width
    delete modifiers.height
  }

  // If fit is specified, use a different operation
  if (modifiers?.fit) {
    switch (modifiers.fit) {
      default:
        modifiers.scale_crop = modifiers.smart_resize
        delete modifiers.smart_resize
        break
    }
    delete modifiers.fit
  }

  const operations = operationsGenerator(modifiers)
  const url = joinURL(cdnURL || 'https://ucarecdn.com', uuid, operations)
  return { url }
}
