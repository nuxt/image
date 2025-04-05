import { joinURL } from 'ufo'
import { defineProvider, createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  joinWith: '&',
})

interface DirectusOptions {
  baseURL: string
  modifiers?: {
    transforms: string[]
  }
}

export default defineProvider<DirectusOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    // Separating the transforms from the rest of the modifiers
    const transforms = modifiers.transforms && Array.isArray(modifiers.transforms) && modifiers.transforms.length > 0
      ? new URLSearchParams(JSON.stringify(Array.from(new Set(modifiers.transforms.map(obj => JSON.stringify(obj)))).map(value => JSON.parse(value)))).toString().replace(/=+$/, '')
      : undefined

    const operations = operationsGenerator({
      ...modifiers,
      transforms,
    })
    return {
      url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
    }
  },
})
