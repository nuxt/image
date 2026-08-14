import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils'
import { useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  build: true,
  nuxtConfig: {
    image: {
      inject: false,
      ipx: {
        baseURL: '/static-images',
      },
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

describe('ipx provider with custom baseURL', () => {
  it('generates static files', async () => {
    const ctx = useTestContext()
    const outputDir = resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public')
    const files = await glob('static-images/**/*', { cwd: outputDir })
    expect(files.sort()).toMatchInlineSnapshot(`
      [
        "static-images/_/images/nuxt.png",
        "static-images/s_300x300/images/colors-layer-config.jpg",
        "static-images/s_300x300/images/colors-layer.jpg",
        "static-images/s_300x300/images/colors.jpg",
        "static-images/s_300x300/images/everest.jpg",
        "static-images/s_300x300/images/tacos.svg",
        "static-images/s_300x300/unsplash/photo-1606112219348-204d7d8b94ee",
        "static-images/s_600x600/images/colors-layer-config.jpg",
        "static-images/s_600x600/images/colors-layer.jpg",
        "static-images/s_600x600/images/colors.jpg",
        "static-images/s_600x600/images/everest.jpg",
        "static-images/s_600x600/images/tacos.svg",
        "static-images/s_600x600/unsplash/photo-1606112219348-204d7d8b94ee",
      ]
    `)
  })
})
