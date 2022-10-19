import type { OperationGeneratorConfig } from '../../types/image'

export default function imageFetch (url: string) {
  return fetch(cleanDoubleSlashes(url))
}

export function getInt (x: unknown): number | undefined {
  if (typeof x === 'number') {
    return x
  }
  if (typeof x === 'string') {
    return parseInt(x, 10)
  }
  return undefined
}

export function getFileExtension (url: string = '') {
  const extension = url.split(/[?#]/).shift()!.split('/').pop()!.split('.').pop()!
  return extension
}

export function cleanDoubleSlashes (path: string = '') {
  return path.replace(/(https?:\/\/)|(\/)+/g, '$1$2')
}

export function createMapper (map: any) {
  return (key?: string) => {
    return key ? map[key] || key : map.missingValue
  }
}

export function createOperationsGenerator ({ formatter, keyMap, joinWith = '/', valueMap }: OperationGeneratorConfig = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`
  }
  if (keyMap && typeof keyMap !== 'function') {
    keyMap = createMapper(keyMap)
  }
  const map = valueMap || {}
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== 'function') {
      map[valueKey] = createMapper(map[valueKey])
    }
  })

  return (modifiers: { [key: string]: string } = {}) => {
    const operations = Object.entries(modifiers)
      .filter(([_, value]) => typeof value !== 'undefined')
      .map(([key, value]) => {
        const mapper = map[key]
        if (typeof mapper === 'function') {
          value = mapper(modifiers[key])
        }

        key = typeof keyMap === 'function' ? keyMap(key) : key

        return formatter!(key, value)
      })

    return operations.join(joinWith)
  }
}

type Attrs = { [key: string]: string|number }

export function renderAttributesToString (attributes: Attrs = {}) {
  return Object.entries(attributes)
    .map(([key, value]) => value ? `${key}="${value}"` : '')
    .filter(Boolean).join(' ')
}

export function renderTag (tag: string, attrs: Attrs, contents?: string) {
  const html = `<${tag} ${renderAttributesToString(attrs)}>`
  if (!contents) {
    return html
  }
  return html + contents + `</${tag}>`
}

export function generateAlt (src: string = '') {
  return src.split(/[?#]/).shift()!.split('/').pop()!.split('.').shift()
}

export function parseSize (input: string | number | undefined = '') {
  if (typeof input === 'number') {
    return input
  }
  if (typeof input === 'string') {
    if (input.replace('px', '').match(/^\d+$/g)) {
      return parseInt(input, 10)
    }
  }
}

export function parseDensities (input: string | undefined = '') {
  if (!input.length) {
    return undefined
  }
  return input.split(' ').map(size => parseInt(size.replace('x', ''), 10))
}
