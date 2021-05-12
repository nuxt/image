import type { ProviderGetImage } from 'src'
import { joinURL } from 'ufo'
import { createOperationsGenerator } from '~image'

const sanityCDN = 'https://cdn.sanity.io/images'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    background: 'b',
    height: 'h',
    quality: 'q',
    width: 'w'
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, projectId, dataset = 'production' } = {}) => {
  const operations = operationsGenerator(modifiers)

  const parts = src.split('-').slice(1)
  const format = parts.pop()

  const filenameAndQueries = parts.join('-') + '.' + format + (operations ? ('?' + operations) : '')

  return {
    url: joinURL(sanityCDN, projectId, dataset, filenameAndQueries)
  }
}
