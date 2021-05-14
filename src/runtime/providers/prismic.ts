import type { ProviderGetImage } from 'src'
import { $URL, joinURL } from 'ufo'
import { operationsGenerator } from './imgix'

const PRISMIC_IMGIX_BUCKET = 'https://images.prismic.io'

// Prismic image bucket is left configurable in order to test on other environments
export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = PRISMIC_IMGIX_BUCKET } = {}
) => {
  const operations = operationsGenerator(modifiers)

  // If there are already some query parameters set by Prismic
  const joinOperator = src.includes('?') ? '&' : '?'

  // Create URL object accordingly
  const url = new $URL(
    joinURL(
      baseURL,
      src.replace(new RegExp(`^${baseURL}`, 'i'), '') +
      (operations ? (joinOperator + operations) : '')
    )
  )

  // Remove duplicated keys, prioritizing override from developers
  Object.entries(url.query).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      url.query[k] = v.pop()
    }
  })

  return {
    url: url.toString()
  }
}
