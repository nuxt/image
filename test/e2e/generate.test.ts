import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { $fetch, setup, useTestContext } from '@nuxt/test-utils'
import { useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  build: true,
  nuxtConfig: {
    image: {
      inject: false,
      preconnect: true,
    },
    nitro: {
      prerender: {
        failOnError: false,
      },
    },
    hooks: {
      'modules:before'() {
        const nuxt = useNuxt()
        nuxt.options.nitro.prerender = { routes: ['/provider/ipx'], failOnError: false }
      },
    },
  },
})

describe('ipx provider', () => {
  it('generates static files', async () => {
    const ctx = useTestContext()
    const outputDir = resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public')
    const files = await glob('_ipx/**/*', { cwd: outputDir })
    expect(files.sort()).toMatchInlineSnapshot(`
      [
        "_ipx/_/images/nuxt.png",
        "_ipx/s_300x300/images/colors-layer-config.jpg",
        "_ipx/s_300x300/images/colors-layer.jpg",
        "_ipx/s_300x300/images/colors.jpg",
        "_ipx/s_300x300/images/everest.jpg",
        "_ipx/s_300x300/images/tacos.svg",
        "_ipx/s_300x300/unsplash/photo-1606112219348-204d7d8b94ee",
        "_ipx/s_600x600/images/colors-layer-config.jpg",
        "_ipx/s_600x600/images/colors-layer.jpg",
        "_ipx/s_600x600/images/colors.jpg",
        "_ipx/s_600x600/images/everest.jpg",
        "_ipx/s_600x600/images/tacos.svg",
        "_ipx/s_600x600/unsplash/photo-1606112219348-204d7d8b94ee",
      ]
    `)
  })
})

describe('preconnect', () => {
  it('preconnects when enabled with the global image option', async () => {
    // `/preconnect-opt-out` renders a cross-origin image without the `preconnect` prop
    const html = await $fetch<string>('/preconnect-opt-out')

    expect(html).toContain('href="https://res.cloudinary.com"')
    expect(html).toContain('rel="preconnect"')
  })

  it('lets the prop disable the global image option', async () => {
    const html = await $fetch<string>('/preconnect-disabled')

    expect(html).toContain('https://res.cloudinary.com')
    expect(html).not.toContain('rel="preconnect"')
  })
})
