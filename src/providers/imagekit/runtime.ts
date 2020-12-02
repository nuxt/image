import { RuntimeProvider, ImageModifiers } from 'types'
import { createOperationsGenerator } from '~image/utils'

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
      outside: 'at_least',
    },
    background (value) {
      if (value.startsWith('#')) {
        return value.replace('#', '')
      }
      return value
    }
  },
  joinWith: ',',
  formatter: (key, value) => `${key}-${value}`
})


export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    debugger
    let operations = operationsGenerator(modifiers as ImageModifiers)
    operations = operations.replace('c-pad_resize', 'cm-pad_resize')
    return {
      url: options.baseURL + src + '?' + (operations ? `tr=${operations}` : '')
    }
  }
}
