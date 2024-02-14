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

export const useBackgroundImage = (
  src: string,
  options: Partial<ImageSizesOptions> & { preload?: boolean; nonce?: string }
) => {
  const $img = useImage()
  const { sizes: bgSizes, imagesizes, imagesrcset } = $img.getBgSizes(src, options)
  const cls = 'nuxt-bg-' + generateRandomString()

  // TODO: handle Map item type
  const toCSS = (bgs: any[]) => {
    const imageSets = bgs.map((bg) => {
      const density = bg.density ? `${bg.density}x` : ''
      const type = bg.type ? `type("${bg.type}")` : ''
      return `url('${bg.src}') ${density} ${type}`
    })
    return `background-image: url(${
      bgs[0].src
    });background-image: image-set(${imageSets.join(', ')});`
  }
  const css = Array.from(bgSizes)
    .reverse()
    .map(([key, value]) => {
      if (key === 'default') {
        return value ? `.${cls}{${toCSS(value)}}` : ''
      } else {
        return `@media (max-width: ${key}px) { .${cls} { ${toCSS(value)} } }`
      }
    }).join(' ')

  if (options.preload) {
    useHead({
      link: [
        {
          rel: 'preload',
          as: 'image',
          nonce: options.nonce,
          href: bgSizes.get('default')?.[0].src,
          ...(bgSizes.size > 1 ? { imagesizes, imagesrcset } : {})
        }
      ]
    })
  }

  useHead({
    style: [
      {
        id: cls,
        innerHTML: css
      }
    ]
  })

  return cls
}
