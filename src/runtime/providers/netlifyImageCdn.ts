import { encodeQueryItem } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator } from '#image'

// https://docs.netlify.com/image-cdn/overview/
export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'fm',
    quality: 'q',
    position: 'position',
    fit: 'fit',
  },
  valueMap: {
    fit: {
      fill: 'fill',
      cover: 'cover',
      contain: 'contain',
    },
    format: {
      avif: 'avif',
      gif: 'gif',
      jpg: 'jpg',
      jpeg: 'jpg',
      png: 'png',
      webp: 'webp',
    },
    position: {
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left',
      center: 'center',
    },
  },
  joinWith: '&',
  formatter: (key, value) => encodeQueryItem(key, value),
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  const mods: Record<string, string> = { ...modifiers }
  mods.url = src
  if (modifiers.width) {
    mods.width = modifiers.width.toString()
  }
  if (modifiers.height) {
    mods.height = modifiers.height.toString()
  }
  const operations = operationsGenerator(mods)
  return {
    url: `${baseURL || '/.netlify/images'}?${operations}`,
  }
}
