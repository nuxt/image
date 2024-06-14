import type { OperationGeneratorConfig } from '@nuxt/image'

export default function imageFetch(url: string) {
  return fetch(cleanDoubleSlashes(url))
}

export function getInt(x: unknown): number | undefined {
  if (typeof x === 'number') {
    return x
  }
  if (typeof x === 'string') {
    return Number.parseInt(x, 10)
  }
  return undefined
}

export function getFileExtension(url = '') {
  const extension = url.split(/[?#]/).shift()!.split('/').pop()!.split('.').pop()!
  return extension
}

export function cleanDoubleSlashes(path = '') {
  return path.replace(/(https?:\/\/)|(\/)+/g, '$1$2')
}

export function createMapper(map: any) {
  return (key?: string) => {
    return key ? map[key] || key : map.missingValue
  }
}

export function createOperationsGenerator({ formatter, keyMap, joinWith = '/', valueMap }: OperationGeneratorConfig = {}) {
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

type Attrs = { [key: string]: string | number }

export function renderAttributesToString(attributes: Attrs = {}) {
  return Object.entries(attributes)
    .map(([key, value]) => value ? `${key}="${value}"` : '')
    .filter(Boolean).join(' ')
}

export function renderTag(tag: string, attrs: Attrs, contents?: string) {
  const html = `<${tag} ${renderAttributesToString(attrs)}>`
  if (!contents) {
    return html
  }
  return html + contents + `</${tag}>`
}

export function generateAlt(src = '') {
  return src.split(/[?#]/).shift()!.split('/').pop()!.split('.').shift()
}

export function parseSize(input: string | number | undefined = '') {
  if (typeof input === 'number') {
    return input
  }
  if (typeof input === 'string') {
    if (input.replace('px', '').match(/^\d+$/g)) {
      return Number.parseInt(input, 10)
    }
  }
}

export function parseDensities(input: string | undefined = ''): number[] {
  if (input === undefined || !input.length) {
    return []
  }

  const densities = new Set<number>()
  for (const density of input.split(' ')) {
    const d = Number.parseInt(density.replace('x', ''))
    if (d) {
      densities.add(d)
    }
  }

  return Array.from(densities)
}

export function checkDensities(densities: number[]) {
  if (densities.length === 0) {
    throw new Error('`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)')
  }
  if (import.meta.dev && Array.from(densities).some(d => d > 2)) {
    const _densities = densities as number[] & { _warned?: boolean }
    if (!_densities._warned) {
      console.warn('[nuxt] [image] Density values above `2` are not recommended. See https://observablehq.com/@eeeps/visual-acuity-and-device-pixel-ratio.')
    }
    _densities._warned = true
  }
}

export function parseSizes(input: Record<string, string | number> | string): Record<string, string> {
  const sizes: Record<string, string> = {}
  // string => object
  if (typeof input === 'string') {
    for (const entry of input.split(/[\s,]+/).filter(e => e)) {
      const s = entry.split(':')
      if (s.length !== 2) {
        sizes['1px'] = s[0].trim()
      }
      else {
        sizes[s[0].trim()] = s[1].trim()
      }
    }
  }
  else {
    Object.assign(sizes, input)
  }
  return sizes
}
