import { RuntimeProvider, ImageModifiers } from 'types'

function predictAdapter (src: string) {
  if (src.match(/^https?:\/\//)) {
    return 'remote'
  }
  return 'local'
}

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, _options: any) {
    const operations = []

    const fit = modifiers.fit ? `_${modifiers.fit}` : ''
    if (modifiers.width && modifiers.height) {
      operations.push(`s_${modifiers.width}_${modifiers.height}${fit}`)
    } else if (modifiers.width) {
      operations.push(`w_${modifiers.width}${fit}`)
    } else if (modifiers.height) {
      operations.push(`h_${modifiers.height}${fit}`)
    }
    if (modifiers.quality) {
      operations.push(`q_${modifiers.quality}`)
    }

    const adapter = predictAdapter(src)

    const operationsString = operations.join(',') || '_'

    return {
      url: `/_image/local/${adapter}/${modifiers.format || '_'}/${operationsString}/${src}`,
      isStatic: true
    }
  }
}
