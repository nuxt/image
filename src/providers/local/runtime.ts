import { RuntimeProvider, ImageModifiers } from '../../types'

export default <RuntimeProvider> {
  generateURL(src: string, modifiers: ImageModifiers, options: any) {
    const operations = []

    if (modifiers.width) {
      operations.push(`w_${modifiers.width}`)
    }
    const operationsString = operations.length ? operations.join(',') : '_'
    return options.baseURL + '/_/' + operationsString + src
  }
}
