import { OperationGeneratorConfig } from 'types'

export function cleanDoubleSlashes (path) {
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

  return (modifiers: { [key: string]: string }) => {
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
