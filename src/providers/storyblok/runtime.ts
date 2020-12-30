import type { ProviderGetImage } from 'src'

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

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = 'https://img2.storyblok.com' } = {}) => {
  const mergeModifiers = overrideUndefined({
    ...defaultModifiers,
    ...modifiers
  })

  const srcWithoutBase = src.replace('https://a.storyblok.com', '')
  const options = `${buildFit(mergeModifiers)}${buildWidth(mergeModifiers)}${buildSmart(mergeModifiers)}${buildFilters(mergeModifiers.filters)}`
  const url = `${baseURL}${options}${srcWithoutBase}`
  return {
    url
  }
}
