import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    key: 'key',
    width: 'width',
    height: 'height',
    format: 'format',
    quality: 'quality',
    fit: 'fit',
    withoutEnlargement: 'withoutEnlargement',
    transforms: 'transforms'
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      inside: 'inside',
      outside: 'outside'
    },
    format: {
      jpg: 'jpg',
      png: 'png',
      webp: 'webp',
      tiff: 'tiff'
    },
    withoutEnlargement: {
      true: 'true',
      false: 'false'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  // Separating the transforms from the rest of the modifiers
  const transforms = modifiers.transforms
  if (transforms && transforms.length > 0 && !Array.isArray(transforms[0])) {
    // Since transforms is one-dimensional array, we need to convert it to two-dimensional
    const twoDimArray = transforms.map((x: string) => x.split(':')).map((x: string[]) => [x[0], isNaN(Number(x[1])) ? x[1] : Number(x[1])].filter(Boolean))
    // We srtringify and encode in URL, then apply back to the modifiers
    modifiers.transforms = new URLSearchParams(JSON.stringify(twoDimArray)).toString().replace(/=+$/, '')
  }
  const operations = operationsGenerator(modifiers)
  // We check if the baseURL is not null and if it doesn't already end with /assets or /assets/
  if (baseURL !== null && !/\/assets\/?$/.test(baseURL)) {
    baseURL += '/assets'
  }
  return {
    url: joinURL(baseURL || 'http://localhost:8055/assets', src + (operations ? ('?' + operations) : ''))
  }
}
