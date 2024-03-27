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

  // Use this to prevent different class names on client and server
  const classStates = useState<Record<string, string>>('_nuxt-img-bg', () => ({}))
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
  const placeholder = '[placeholder]'

  let css = Array.from(bgSizes)
    .reverse()
    .map(([key, value]) => {
      if (key === 'default') {
        return value ? `.${placeholder}{${toCSS(value)}}` : ''
      } else {
        return `@media (max-width: ${key}px) { .${placeholder} { ${toCSS(value)} } }`
      }
    }).join(' ')

  // use generated css as key
  let cls = ''
  if (classStates.value[css]) {
    cls = classStates.value[css]
  } else {
    cls = 'nuxt-bg-' + generateRandomString()
    classStates.value[css] = cls
  }
  css = css.replace(/\[placeholder\]/gm, cls)

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
      { key: cls, innerHTML: css }
    ]
  })

  return cls
}
