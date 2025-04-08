import { joinURL, encodePath } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  joinWith: '/',
  formatter: (key: any, value: any) => {
    if (typeof value === 'object') {
      return `${key},${encodePath(Object.entries(value).map(([k, v]) => `${k}_${v}`).join(','))}`
    }
    return `${key},${encodePath(value)}`
  },
})

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {},
) => {
  if (!baseURL) {
    // also support runtime config
    baseURL = useRuntimeConfig().public.siteUrl
  }
  const _modifiers = { ...modifiers }
  const { resize, width, height, quality } = _modifiers

  let resizeValue = {}
  if (width && height) {
    resizeValue = { fw: width, fh: height }
  }
  else if (width) {
    resizeValue = { w: width }
  }
  else if (height) {
    resizeValue = { h: height }
  }
  if (!resize && Object.keys(resizeValue).length) {
    _modifiers.resize = resizeValue
  }
  delete _modifiers.width
  delete _modifiers.height

  if (quality) {
    _modifiers.quality = `Q_${quality}`
  }

  const operations = operationsGenerator(_modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? '?image_process=' + operations : '')),
  }
}
