import { joinURL } from 'ufo'
import { defineProvider, createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  joinWith: '/',
  formatter: (key: string | number, value: string | number | ReturnType<typeof getResizeValue>) => {
    if (typeof value === 'object') {
      return `${key},${Object.entries(value).map(([k, v]) => `${k}_${v}`).join(',')}`
    }
    return `${key},${value}`
  },
})

interface AliyunOptions {
  baseURL?: string
  modifiers?: {
    resize?: { w: number } | { h: number } | { fw: number, fh: number }
    quality?: ''
  }
}

function getResizeValue(height?: number, width?: number) {
  if (width && height) {
    return { fw: width, fh: height }
  }
  else if (width) {
    return { w: width }
  }
  else if (height) {
    return { h: height }
  }
}

export default defineProvider<AliyunOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    if (!baseURL) {
      // also support runtime config
      baseURL = useRuntimeConfig().public.siteUrl as string | undefined || '/'
    }
    const _modifiers = { ...modifiers }
    const { resize, width, height, quality } = _modifiers

    const resizeValue = getResizeValue(height, width)
    if (!resize && resizeValue) {
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
  },
})
