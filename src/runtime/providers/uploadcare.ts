/**
 * Image provider for Uploadcare
 * URL API reference:
 * @link https://uploadcare.com/api-refs/url-api/
 *
 * URL format: https://ucarecdn.com/:uuid/-/:operation/:params/:filename
 *
 * Operations:
 * [X] Image Compression
 * [/] Image Geometry
 * [ ] Image Overlays
 * [ ] Image Colours
 * [ ] Image Definition
 * [ ] Image Rotations
 *
 * Other stuff to think about later:
 * - Signed URLs
 * - File Groups
 */

import { joinURL, hasProtocol, withTrailingSlash } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  joinWith: '',
  formatter: (key: string, value: string | string[]) => `-/${key}/${Array.isArray(value) ? value.join('/') : value}/`,
})

export const getImage: ProviderGetImage = (
  uuid,
  { modifiers, cdnURL = '' } = {},
) => {
  // If width or height is specified, use resize instead
  if (modifiers?.width || modifiers?.height) {
    modifiers.resize = `${modifiers?.width || ''}x${modifiers?.height || ''}`

    delete modifiers?.width
    delete modifiers?.height
  }

  // If fit is specified, use a different operation
  if (modifiers?.fit) {
    switch (modifiers.fit) {
      case 'cover':
        modifiers.scale_crop = [modifiers.resize, 'center']
        delete modifiers.resize
        break
      case 'contain':
        modifiers.stretch = 'off'
        break
        //   case 'fill':
        //   case 'inside':
        //   case 'outside':
        //     modifiers.crop = modifiers.smart_resize
        //     break
      default:
        modifiers.smart_resize = modifiers.resize
        delete modifiers.resize
        break
    }
    delete modifiers.fit
  }

  const operations = operationsGenerator(modifiers)
  const base = hasProtocol(uuid) ? '' : (cdnURL || 'https://ucarecdn.com')
  const url = withTrailingSlash(joinURL(base, uuid, operations))
  return { url }
}
