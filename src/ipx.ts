import { relative, resolve } from 'pathe'
import { useNuxt, createResolver, useNitro } from '@nuxt/kit'
import type { NitroEventHandler } from 'nitropack'
import type { HTTPStorageOptions, NodeFSSOptions, IPXOptions } from 'ipx'
import { defu } from 'defu'
import type { ProviderSetup } from './types'

type IPXRuntimeConfig = Omit<IPXOptions, 'storage' | 'httpStorage'> & { http: HTTPStorageOptions, fs: NodeFSSOptions } & {
  baseURL: string
}

type IPXSetupT = (setupOptions?: { isStatic: boolean }) => ProviderSetup

export const ipxSetup: IPXSetupT = setupOptions => (providerOptions, moduleOptions) => {
  const resolver = createResolver(import.meta.url)
  const nitro = useNitro()
  const nuxt = useNuxt()

  const ipxBase = moduleOptions.base /* TODO */ || '/_ipx'

  // Avoid overriding user custom handler
  const hasUserProvidedIPX =
    nuxt.options.serverHandlers.find(handler => handler.route?.startsWith(ipxBase)) ||
    nuxt.options.devServerHandlers.find(handler => handler.route?.startsWith(ipxBase))
  if (hasUserProvidedIPX) {
    return
  }

  // Options
  const absoluteDir = resolve(nuxt.options.srcDir, moduleOptions.dir || nuxt.options.dir.public)
  const relativeDir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
  const ipxOptions: IPXRuntimeConfig = {
    maxAge: providerOptions.options?.maxAge,
    sharpOptions: moduleOptions.sharp,
    alias: moduleOptions.alias,
    baseURL: ipxBase,
    fs: {
      dir: nuxt.options.dev ? absoluteDir : relativeDir
    },
    http: {
      domains: moduleOptions.domains
    }
  }

  nitro.options._config.runtimeConfig = nitro.options._config.runtimeConfig || {}
  nitro.options.runtimeConfig.ipx = ipxOptions

  const ipxHandler = <NitroEventHandler>{
    route: `${ipxBase}/**`,
    middleware: false,
    handler: resolver.resolve('./runtime/ipx')
  }

  if (!setupOptions?.isStatic) {
    nitro.options.handlers.push(ipxHandler)
  }

  // Prerenderer
  if (!nitro.options.dev) {
    nitro.options._config.runtimeConfig.ipx = defu({ fs: { dir: absoluteDir } }, ipxOptions)
    nitro.options._config.handlers!.push(ipxHandler)
  }
}

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    ipx?: IPXRuntimeConfig
  }
}
