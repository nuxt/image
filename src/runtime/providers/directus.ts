import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  joinWith: '&'
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  // Separating the transforms from the rest of the modifiers
  let transforms = modifiers.transforms
  if (transforms && transforms.length > 0) {
    // de-duplicate (can get multiplied when haveing >1 densities configured)
    transforms = transforms.filter((value: any, index: any) => transforms.indexOf(value) === index)
    // We stringify and encode in URL the list of lists, then apply it back to the modifiers
    modifiers.transforms = new URLSearchParams(JSON.stringify(transforms)).toString().replace(/=+$/, '') as unknown as (string | number)[][]
  }
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : ''))
  }
}
