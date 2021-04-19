import type { ProviderGetImage } from 'src'
import { joinURL, withoutTrailingSlash } from 'ufo'
import { createOperationsGenerator } from '~image'

const convertHextoRGBFormat = (value: string) => value.startsWith('#') ? value.replace('#', 'rgb_') : value
const removePathExtension = (value: string) => value.replace(/\.[^/.]+$/, '')

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'c',
    width: 'w',
    height: 'h',
    format: 'f',
    quality: 'q',
    background: 'b',
    rotate: 'a',
    roundCorner: 'r',
    gravity: 'g',
    effect: 'e',
    color: 'co',
    flags: 'fl',
    dpr: 'dpr',
    opacity: 'o',
    overlay: 'l',
    underlay: 'u',
    transformation: 't',
    zoom: 'z',
    colorSpace: 'cs',
    customFunc: 'fn',
    density: 'dpi'
  },
  valueMap: {
    fit: {
      fill: 'fill',
      inside: 'pad',
      outside: 'lpad',
      cover: 'fit',
      contain: 'scale',
      minCover: 'mfit',
      minInside: 'mpad',
      thumbnail: 'thumb',
      cropping: 'crop',
      coverLimit: 'limit'
    },
    background (value: string) {
      return convertHextoRGBFormat(value)
    },
    color (value: string) {
      return convertHextoRGBFormat(value)
    },
    gravity: {
      auto: 'auto',
      subject: 'auto:subject',
      face: 'face',
      sink: 'sink',
      faceCenter: 'face:center',
      multipleFaces: 'faces',
      multipleFacesCenter: 'faces:center',
      north: 'north',
      northEast: 'north_east',
      northWest: 'north_west',
      west: 'west',
      southWest: 'south_west',
      south: 'south',
      southEast: 'south_east',
      east: 'east',
      center: 'center'
    }
  },
  joinWith: ',',
  formatter: (key, value) => `${key}_${value}`
})

const defaultModifiers = {
  format: 'auto',
  quality: 'auto'
}

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const mergeModifiers = { ...defaultModifiers, ...modifiers }

  // Fetch mode allows you to pass in full non-cloudinary URLS and have them "lazy-uploaded"
  // see: https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url
  const isFetchMode = withoutTrailingSlash(baseURL).endsWith('/fetch')
  // If the src is not using fetch mode then we need to remove the extension (if it exists)
  if (!isFetchMode) {
    src = removePathExtension(src)
  }

  const operations = operationsGenerator(mergeModifiers as any)

  return {
    url: joinURL(baseURL, operations, src)
  }
}
