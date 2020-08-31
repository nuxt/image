import { RuntimeProvider, ImageModifiers } from '../../types'

export default <RuntimeProvider> {
  generateURL(src: string, modifiers: ImageModifiers, options: any) {
    const operations = Object.keys(modifiers)
        .map(name => `${name}=${modifiers[name]}`)
    
    const operationsString = operations.join('/')
    return options.baseURL + src + '?twic=v1/' + operationsString
  }
}
