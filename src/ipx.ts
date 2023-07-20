import { relative, resolve } from 'pathe'
import { eventHandler } from 'h3'
import { useNuxt, createResolver, useNitro } from '@nuxt/kit'
import type { NitroEventHandler, NitroDevEventHandler } from 'nitropack'

import type { ProviderSetup } from './types'

interface IPXRuntimeConfig {
  dir: string
  maxAge?: any
  domains: string[]
  sharp: any
  alias: Record<string, string>
}

export const ipxSetup: (setupOptions?: { isStatic: boolean }) => ProviderSetup = setupOptions => async (providerOptions, moduleOptions) => {
  const nitro = useNitro()
  const nuxt = useNuxt()

  // Add IPX middleware unless nuxtrc or user added a custom middleware
  const hasUserProvidedIPX =
    nuxt.options.serverHandlers.find(handler => handler.route?.startsWith('/_ipx')) ||
    nuxt.options.devServerHandlers.find(handler => handler.route?.startsWith('/_ipx'))
  if (hasUserProvidedIPX) {
    return
  }

  // Options
  const ipxOptions = {
    dir: resolve(nuxt.options.srcDir, moduleOptions.dir || nuxt.options.dir.public),
    maxAge: providerOptions.options?.maxAge,
    domains: moduleOptions.domains,
    sharp: moduleOptions.sharp,
    alias: moduleOptions.alias
  } satisfies IPXRuntimeConfig

  // Add handler for production
  if (!nuxt.options.dev) {
    // TODO: Avoid adding for non-Node.js environments with a warning
    const resolver = createResolver(import.meta.url)
    // Use absolute path for prerenderer
    // TODO: Workaround for prerender support
    // https://github.com/nuxt/image/pull/784
    nitro.options._config.runtimeConfig = nitro.options._config.runtimeConfig || {}
    nitro.options._config.runtimeConfig.ipx = { ...ipxOptions }
    // Use relative path for built app
    ipxOptions.dir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
    nitro.options.runtimeConfig.ipx = ipxOptions

    const handler: NitroEventHandler = {
      route: '/_ipx/**',
      handler: resolver.resolve('./runtime/ipx')
    }
    if (!setupOptions?.isStatic) {
      nitro.options.handlers.push(handler)
    }
    // TODO: Workaround for prerender support
    nitro.options._config.handlers!.push(handler)
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
  const devHandler: NitroDevEventHandler = {
    route: '/_ipx',
    handler: eventHandler(async (event) => {
      await middleware(event.node.req, event.node.res)
    })
  }
  nitro.options.devHandlers.push(devHandler)
  // TODO: Workaround for prerender support
  nitro.options._config.devHandlers!.push(devHandler)
}

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    ipx?: IPXRuntimeConfig
  }
}
