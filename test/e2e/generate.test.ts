import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils'
import { useNuxt } from '@nuxt/kit'
import { resolve } from 'pathe'
import { globby } from 'globby'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  build: true,
  nuxtConfig: {
    image: {
      inject: false
    },
    hooks: {
      'modules:before' () {
        const nuxt = useNuxt()
        nuxt.options.nitro.prerender = { routes: ['/provider/ipx'] }
      }
    }
  }
})

describe('ipx provider', () => {
  it('generates static files', async () => {
    const ctx = useTestContext()
    const outputDir = resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/_ipx')
    const files = await globby(outputDir)
    expect(files.sort().map(f => f.replace(outputDir, '/_ipx'))).toMatchInlineSnapshot(`
      [
        "/_ipx/_/images/nuxt.png",
        "/_ipx/s_300x300/images/colors.jpg",
        "/_ipx/s_300x300/images/everest.jpg",
        "/_ipx/s_300x300/images/tacos.svg",
        "/_ipx/s_300x300/unsplash/photo-1606112219348-204d7d8b94ee",
      ]
    `)
  })
})
