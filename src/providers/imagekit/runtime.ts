import type { RuntimeProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'c',
    width: 'w',
    height: 'h',
    format: 'f',
    quality: 'q',
    background: 'bg'
  },
  valueMap: {
    fit: {
      cover: 'maintain_ratio',
      contain: 'pad_resize',
      fill: 'force',
      inside: 'at_max',
      outside: 'at_least'
    },
    background (value = '') {
      if (value.startsWith('#')) {
        return value.replace('#', '')
      }
      return value
    }
  },
  joinWith: ',',
  formatter: (key, value) => `${key}-${value}`
})

export const getImage: RuntimeProviderGetImage = (src, { modifiers, baseURL }) => {
  let operations = operationsGenerator(modifiers)
  operations = operations.replace('c-pad_resize', 'cm-pad_resize')
  return {
    url: baseURL + src + '?' + (operations ? `tr=${operations}` : '')
  }
}
