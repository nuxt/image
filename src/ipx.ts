import { relative, resolve } from 'pathe'
import { eventHandler } from 'h3'
import { useNuxt, createResolver } from '@nuxt/kit'

import type { ProviderSetup, ImageProviders } from './types'

export const ipxSetup: ProviderSetup = async (providerOptions, moduleOptions) => {
  const nuxt = useNuxt()

  // Add IPX middleware unless nuxtrc or user added a custom middleware
  const hasUserProvidedIPX =
    nuxt.options.serverHandlers.find(handler => handler.route?.startsWith('/_ipx')) ||
    nuxt.options.devServerHandlers.find(handler => handler.route?.startsWith('/_ipx'))
  if (hasUserProvidedIPX) {
    return
  }

  // Options
  const ipxOptions: ImageProviders['ipx'] = {
    dir: resolve(nuxt.options.srcDir, moduleOptions.dir || nuxt.options.dir.public),
    maxAge: providerOptions.options?.maxAge,
    domains: moduleOptions.domains,
    sharp: moduleOptions.sharp,
    alias: moduleOptions.alias
  }

  // Add handler for production
  if (!nuxt.options.dev) {
    // TODO: Avoid adding for non-Node.js environments with a warning
    const resolver = createResolver(import.meta.url)
    nuxt.hook('nitro:init', (nitro) => {
      ipxOptions.dir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
      nitro.options.runtimeConfig.ipx = ipxOptions
    })
    nuxt.options.serverHandlers.push({
      route: '/_ipx/**',
      handler: resolver.resolve('./runtime/ipx')
    })
    return
  }

  // Add as dev handler for development
  const { createIPX, createIPXMiddleware } = await import('ipx')
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[@nuxt/image] `ipx` is an optional dependency for local image optimization and is not installed.')
      throw new Error(err)
    })
  const ipx = createIPX(ipxOptions)
  const middleware = createIPXMiddleware(ipx)
  nuxt.options.devServerHandlers.push({
    route: '/_ipx',
    handler: eventHandler(async (event) => {
      await middleware(event.req, event.res)
    })
  })
}
