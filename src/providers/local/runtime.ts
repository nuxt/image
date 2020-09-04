import { RuntimeProvider, ImageModifiers } from '../../types'

export default <RuntimeProvider> {
  generateURL(src: string, modifiers: ImageModifiers, options: any) {
    const operations = []

    if (modifiers.contain) {
      const [w, h] = modifiers.contain.split('x')
      operations.push(`s_${w}_${h}`)
    }
    const operationsString = operations.length ? operations.join(',') : '_'
    return options.baseURL + '/_/' + operationsString + src
  }
}
