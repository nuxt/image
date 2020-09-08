import { RuntimeProvider, ImageModifiers } from '../../types'

export default <RuntimeProvider> {
  generateURL(src: string, modifiers: ImageModifiers, options: any) {
    const operations = []

    if (modifiers.width || modifiers.height) {
      operations.push(`resize=${modifiers.width || '-'}x${modifiers.height || '-'}`)
    }
    
    const operationsString = operations.join('/')
    return options.baseURL + src + '?twic=v1/' + operationsString
  }
}
