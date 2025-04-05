import type { OperationGeneratorConfig } from '../../module'

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

export interface Mapper<Key, Value> {
  (key: Key): Value | Key
  (): undefined
}

export function createMapper<Key extends string, Value>(map: Partial<Record<Key, Value>> & { missingValue?: Value }): Mapper<Key, Value> {
  return (key => key !== undefined ? map[key as Extract<Key, string>] || key : map.missingValue) as Mapper<Key, Value>
}

type Formatter<Key, Value> = (key: Key, value: Value) => string

const defaultFormatter = (key: string, value: string | number) => `${key}=${value}`

export function createOperationsGenerator<ModifierKey extends string, ModifierValue = string | number, FinalKey = ModifierKey, FinalValue = ModifierValue>(config: OperationGeneratorConfig<ModifierKey, ModifierValue, FinalKey, FinalValue>) {
  const formatter = config.formatter || (defaultFormatter as Formatter<FinalKey, FinalValue>)

  const keyMap = config.keyMap && typeof config.keyMap !== 'function' ? createMapper<ModifierKey, FinalKey>(config.keyMap) : config.keyMap

  const map: Record<string, Mapper<ModifierValue, FinalValue>> = {}
  for (const key in config.valueMap) {
    const valueKey = key as ModifierKey
    const value = config.valueMap[valueKey]!
    map[valueKey] = typeof value === 'object'
      ? createMapper<Extract<ModifierValue, string>, FinalValue>(value as Exclude<typeof value, (...args: never) => unknown>) as Mapper<ModifierValue, FinalValue>
      : value as Mapper<ModifierValue, FinalValue>
  }

  return (modifiers: Partial<Record<Extract<ModifierKey | FinalKey, string>, ModifierValue | FinalValue>>): string => {
    const operations: string[] = []
    for (const _key in modifiers) {
      const key = _key as keyof typeof modifiers
      if (typeof modifiers[key] === 'undefined') {
        continue
      }
      const value = typeof map[key] === 'function'
        ? map[key](modifiers[key] as ModifierValue)
        : modifiers[key]

      operations.push(formatter(((keyMap ? keyMap(key as ModifierKey) : key) as FinalKey), value as FinalValue))
    }

    return operations.join(config.joinWith || '/')
  }
}

export type InferModifiers<T extends (modifiers: any) => string> = T extends (modifiers: infer Modifiers) => string ? Modifiers : Record<string, unknown>

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
        sizes['1px'] = s[0]!.trim()
      }
      else {
        sizes[s[0]!.trim()] = s[1]!.trim()
      }
    }
  }
  else {
    Object.assign(sizes, input)
  }
  return sizes
}
