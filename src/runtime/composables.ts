import type { $Img, ImageSizesOptions } from '../types'
import { generateRandomString } from './utils'
import { createImage } from './image'
// @ts-expect-error virtual file
import { imageOptions } from '#build/image-options'
import { useNuxtApp, useRuntimeConfig, useHead } from '#imports'

export const useImage = (): $Img => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$img as $Img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL
    }
  }))
}

export const useBackgroundImage = (src: string, options: Partial<ImageSizesOptions>) => {
  const $img = useImage()
  const bgSizes = $img.getBgSizes(src, options)
  const cls = 'nuxt-bg-' + generateRandomString()
  const defaultBg = bgSizes.get('default')

  // TODO: handle Map item type
  const toCSS = (bgs: any[]) => {
    const imageSets = bgs.map((bg) => {
      const density = bg.density ? `${bg.density}x` : ''
      const type = bg.type ? `type("${bg.type}")` : ''
      return `url('${bg.src}') ${density} ${type}`
    })
    return `background-image: url(${bgs[0].src});background-image: image-set(${imageSets.join(', ')});`
  }
  const defaultBgCSS = defaultBg ? `.${cls}{${toCSS(defaultBg)}}` : ''
  bgSizes.delete('default')
  const css = Array.from(bgSizes).reverse().map(([key, value]) => {
    return `@media (max-width: ${key}px) { .${cls} { ${toCSS(value)} } }`
  })

  useHead({
    style: [
      {
        id: cls,
        innerHTML: defaultBgCSS + css.join(' ')
      }
    ]
  })

  return cls
}
