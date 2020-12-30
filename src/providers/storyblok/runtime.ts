import { RuntimeProvider, ImageModifiers } from 'types'

const defaultModifiers = {
  width: '0',
  height: '0'
}

const buildWidth = (mergeModifiers) => {
  const { width, height } = mergeModifiers

  if (width === '0' && height === '0') { return '' }

  return `/${width}x${height}`
}

const buildFit = ({ fit }) => fit ? `/fit-${fit}` : ''

const buildSmart = ({ smart }) => typeof smart !== 'undefined' ? '/smart' : ''

const buildFilters = (filters) => {
  if (!filters) { return '' }

  let string = '/filters'

  for (const f in filters) {
    string += `:${f}(${filters[f]})`
  }

  return string
}

const overrideUndefined = (modifiers) => {
  const ret = modifiers
  for (const key in modifiers) {
    if (typeof modifiers[key] === 'undefined' && typeof defaultModifiers[key] !== 'undefined') {
      ret[key] = defaultModifiers[key]
    }
  }
  return ret
}

export default <RuntimeProvider> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getImage (src: string, modifiers: ImageModifiers, { baseURL }: any) {
    const mergeModifiers = overrideUndefined({
      ...defaultModifiers,
      ...modifiers
    })
    console.log(mergeModifiers)
    if (mergeModifiers.fit !== 'in') {
      delete mergeModifiers.fit
    }
    const endUrl = `${buildFit(mergeModifiers)}${buildWidth(mergeModifiers)}${buildSmart(mergeModifiers)}${buildFilters(mergeModifiers.filters)}`
    const url = `${baseURL}${endUrl}${src}`
    return {
      url
    }
  }
}
