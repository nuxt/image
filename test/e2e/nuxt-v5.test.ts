import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { $fetch, setup, useTestContext, url, fetch } from '@nuxt/test-utils'
import { useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'

await setup({
  rootDir: fileURLToPath(new URL('../fixtures/nuxt-v5', import.meta.url)),
  build: true,
  nuxtConfig: {
    hooks: {
      'modules:before'() {
        const nuxt = useNuxt()
        nuxt.options.nitro.prerender = { routes: ['/'], failOnError: false }
      },
    },
  },
})

describe('nuxt v5', () => {
  it('renders images', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('src="/_ipx/s_300x300/images/nuxt.png"')
    expect(html).toContain('<link rel="preload" as="image" href="/_ipx/s_600x600/images/nuxt.png" imagesrcset="/_ipx/s_300x300/images/nuxt.png 1x, /_ipx/s_600x600/images/nuxt.png 2x">')
    expect(html).toContain('<source type="image/webp"')
    expect(html).toContain('/_ipx/f_webp&amp;s_640x640/images/nuxt.png 640w')
  })

  it('generates static files', async () => {
    const ctx = useTestContext()
    const outputDir = resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public')
    const files = await glob('_ipx/**/*', { cwd: outputDir })
    expect(files.sort()).toMatchInlineSnapshot(`
      [
        "_ipx/f_png&s_1024x1024/images/nuxt.png",
        "_ipx/f_png&s_1280x1280/images/nuxt.png",
        "_ipx/f_png&s_1536x1536/images/nuxt.png",
        "_ipx/f_png&s_2048x2048/images/nuxt.png",
        "_ipx/f_png&s_2560x2560/images/nuxt.png",
        "_ipx/f_png&s_3072x3072/images/nuxt.png",
        "_ipx/f_png&s_640x640/images/nuxt.png",
        "_ipx/f_png&s_768x768/images/nuxt.png",
        "_ipx/f_webp&s_1024x1024/images/nuxt.png",
        "_ipx/f_webp&s_1280x1280/images/nuxt.png",
        "_ipx/f_webp&s_1536x1536/images/nuxt.png",
        "_ipx/f_webp&s_2048x2048/images/nuxt.png",
        "_ipx/f_webp&s_2560x2560/images/nuxt.png",
        "_ipx/f_webp&s_3072x3072/images/nuxt.png",
        "_ipx/f_webp&s_640x640/images/nuxt.png",
        "_ipx/f_webp&s_768x768/images/nuxt.png",
        "_ipx/s_300x300/images/nuxt.png",
        "_ipx/s_600x600/images/nuxt.png",
      ]
    `)
  })

  it('works with runtime ipx', async () => {
    const res = await fetch(url('/_ipx/s_300x300/images/nuxt.png'))
    expect(res.headers.get('content-type')).toBe('image/png')
  })

  it('works with server-side useImage', async () => {
    expect(await $fetch('/api/image' as any)).toMatchInlineSnapshot(`
      {
        "format": "webp",
        "url": "/_ipx/f_webp&q_75/image.jpg",
      }
    `)
  })
})
