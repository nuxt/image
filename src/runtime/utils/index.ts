import type { OperationGeneratorConfig } from '../../types/image'

export default function imageFetch (url: string) {
  return fetch(cleanDoubleSlashes(url))
}

export function getInt (x): number | undefined {
  if (typeof x === 'number') {
    return x
  }
  if (typeof x === 'string') {
    return parseInt(x, 10)
  }
  return undefined
}

export function getFileExtension (url: string = '') {
  const extension = url.split(/[?#]/).shift().split('/').pop().split('.').pop()
  return extension
}

export function cleanDoubleSlashes (path: string = '') {
  return path.replace(/(https?:\/\/)|(\/)+/g, '$1$2')
}

export function createMapper (map: any) {
  return (key: string) => {
    return map[key] || key || map.missingValue
  }
}

export function createOperationsGenerator ({ formatter, keyMap, joinWith = '/', valueMap }: OperationGeneratorConfig = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`
  }
  if (keyMap && typeof keyMap !== 'function') {
    keyMap = createMapper(keyMap)
  }
  valueMap = valueMap || {}
  Object.keys(valueMap).forEach((valueKey) => {
    if (typeof valueMap[valueKey] !== 'function') {
      valueMap[valueKey] = createMapper(valueMap[valueKey])
    }
  })

  return (modifiers: { [key: string]: string } = {}) => {
    const operations = Object.entries(modifiers)
      .filter(([_, value]) => typeof value !== 'undefined')
      .map(([key, value]) => {
        const mapper = valueMap[key]
        if (typeof mapper === 'function') {
          value = mapper(modifiers[key])
        }

        key = typeof keyMap === 'function' ? keyMap(key) : key

        return formatter(key, value)
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
  return src.split(/[?#]/).shift().split('/').pop().split('.').shift()
}

export function parseSize (input = '') {
  if (typeof input === 'number') {
    return input
  }
  if (typeof input === 'string') {
    if (input.replace('px', '').match(/^\d+$/g)) {
      return parseInt(input, 10)
    }
  }
}
