import { RuntimeProvider, ImageModifiers } from '../../types'

export default <RuntimeProvider> {
  generateURL(src: string, modifiers: ImageModifiers, options: any) {
    const operations = []

    if (modifiers.width) {
      operations.push('w_' + modifiers.width)
    }
    if (modifiers.height) {
      operations.push('h_' + modifiers.height)
    }
    if (modifiers.resize) {
      operations.push('c_' + modifiers.resize)
    }
    
    const operationsString = operations.join(',')
    return options.baseURL + '/' + operationsString + src
  }
}
