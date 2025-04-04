import { joinURL, encodePath, encodeParam } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator, chooseDefaultFormat, getFileExtension } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'f',
    fit: 'fit',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b',
  },
  joinWith: '&',
  formatter: (key, val) => encodeParam(key) + '_' + encodeParam(val),
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, '/_ipx')
  }

  let format = modifiers.format

  if (format === 'auto' || Object.keys(modifiers).length === 0) {
    // Use URL style with modifiers as second path segment: /_ipx/f_auto&s_300x300/source.jpg
    const params = operationsGenerator(modifiers) || '_'

    return {
      url: joinURL(baseURL, params, encodePath(src)),
    }
  }

  if (!format) {
    format = chooseDefaultFormat(getFileExtension(src))
  }

  // Use URL style with modifiers at end of filename, format as extension: /_ipx/~/source.jpg@s_300x300.webp
  delete modifiers.format
  const params = operationsGenerator(modifiers) || '_'

  return {
    url: joinURL(baseURL, '~', `${encodePath(src)}@@${params}.${format}`),
  }
}

export const validateDomains = true
export const supportsAlias = true
