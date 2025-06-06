import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils'
import { useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'

await setup({
  rootDir: './playground',
  build: true,
  nuxtConfig: {
    image: {
      inject: false,
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
    devtools: { enabled: false },
    telemetry: false,
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
        "_ipx/s_300x300/images/colors.jpg",
        "_ipx/s_300x300/images/everest.jpg",
        "_ipx/s_300x300/images/tacos.svg",
        "_ipx/s_300x300/unsplash/photo-1606112219348-204d7d8b94ee",
        "_ipx/s_600x600/images/colors.jpg",
        "_ipx/s_600x600/images/everest.jpg",
        "_ipx/s_600x600/images/tacos.svg",
        "_ipx/s_600x600/unsplash/photo-1606112219348-204d7d8b94ee",
      ]
    `)
  })
})
