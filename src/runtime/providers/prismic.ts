import { joinURL, parseQuery, parseURL, stringifyQuery } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { operationsGenerator } from './imgix'

const PRISMIC_IMGIX_BUCKET = 'https://images.prismic.io'

// Prismic image bucket is left configurable in order to test on other environments
export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = PRISMIC_IMGIX_BUCKET } = {},
) => {
  const operations = operationsGenerator(modifiers)

  const parsedURL = parseURL(src)

  return {
    url: joinURL(
      baseURL,
      parsedURL.pathname + '?'
      // Remove duplicated keys, prioritizing override from developers
      + stringifyQuery(Object.assign(parseQuery(parsedURL.search), parseQuery(operations))),
    ),
  }
}
