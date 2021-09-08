import { ProviderGetImage } from 'src'

// https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#upload

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = 'http://localhost:1337/uploads' } = {}) => {
  const breakpoint = modifiers?.breakpoint || ''

  if (src.startsWith('/')) {
    src = src.slice(1)
  }

  if (baseURL.endsWith('/')) {
    baseURL = baseURL.replace(/\/$/, '')
  }

  if (!breakpoint) {
    return {
      url: `${baseURL}/${src}`
    }
  }

  return {
    url: `${baseURL}/${breakpoint}_${src}`
  }
}

export const validateDomains = true
