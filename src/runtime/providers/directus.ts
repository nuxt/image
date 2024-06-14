import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  joinWith: '&',
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  // Separating the transforms from the rest of the modifiers
  let transforms = modifiers.transforms
  if (transforms && Array.isArray(transforms) && transforms.length > 0) {
    // de-duplicate (can get multiplied when having >1 densities configured)
    transforms = Array.from(new Set(transforms.map(obj => JSON.stringify(obj)))).map(value => JSON.parse(value))
    // We stringify and encode in URL the list of lists, then apply it back to the modifiers
    modifiers.transforms = new URLSearchParams(JSON.stringify(transforms)).toString().replace(/=+$/, '') as unknown as (string | number)[][]
  }
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
  }
}
