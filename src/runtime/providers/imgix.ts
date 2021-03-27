import type { ProviderGetImage } from 'src'
import md5 from 'md5'
import { joinURL } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'fm'
  },
  valueMap: {
    fit: {
      fill: 'scale',
      inside: 'fit-max',
      outside: 'fit-min',
      cover: 'crop',
      contain: 'fill'
    }
  },
  joinWith: '&',
  formatter: (key, value) => {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(value)

    return `${encodedKey}=${encodedValue}`
  }
})

const sanitizePath = (src: string): string => {
  const path = src.replace(/^\//, '')

  const encodedPath = /^https?:\/\//.test(path)
    ? encodeURIComponent(path)
    : encodeURI(path)
      .replace(/[#?:+]/g, encodeURIComponent)

  return `/${encodedPath}`
}

export const getImage: ProviderGetImage = (src, { options = {}, modifiers = {}, baseURL = '/' } = {}) => {
  const { token } = options
  const operations = operationsGenerator(modifiers)
  const queryString = operations ? `?${operations}` : ''

  if (!token) {
    return { url: joinURL(baseURL, src + queryString) }
  }

  const sanitizedPath = sanitizePath(src)
  const signature = md5(token + sanitizedPath + queryString)
  const delimiter = queryString ? '&' : '?'

  return {
    url: joinURL(baseURL, sanitizedPath + queryString + delimiter + `s=${signature}`)
  }
}
