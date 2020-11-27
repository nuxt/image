import { RuntimeProvider, ImageModifiers } from 'types'
import { createOperationsGenerator, isRemoteUrl } from '~image/utils'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'f',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b'
  },
  joinWith: ',',
  formatter: (key, value) => `${key}_${value}`
})

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const format = modifiers.format || '_'
    delete modifiers.format

    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}_${modifiers.height}`
      delete modifiers.width
      delete modifiers.height
    }
    src = isRemoteUrl(src) ? src : (options.baseURL || '') + src

    const operationsString = operationsGenerator(modifiers) || '_'

    return {
      url: `/_image/local/remote/${format}/${operationsString}/${src}`,
      isStatic: true
    }
  }
}
