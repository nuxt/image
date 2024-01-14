import { relative, resolve } from 'pathe'
import { useNuxt, createResolver, useNitro } from '@nuxt/kit'
import type { NitroEventHandler } from 'nitropack'
import type { HTTPStorageOptions, NodeFSSOptions, IPXOptions } from 'ipx'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import type { ProviderSetup } from './types'

export type IPXRuntimeConfig = Omit<IPXOptions, 'storage' | 'httpStorage'> & { http: HTTPStorageOptions, fs: NodeFSSOptions } & {
  baseURL: string
}

type IPXSetupT = (setupOptions?: { isStatic: boolean }) => ProviderSetup

export const ipxSetup: IPXSetupT = setupOptions => async (providerOptions, moduleOptions) => {
  const resolver = createResolver(import.meta.url)
  const nitro = useNitro()
  const nuxt = useNuxt()

  const ipxBaseURL = providerOptions.options?.baseURL || '/_ipx'

  // Avoid overriding user custom handler
  const hasUserProvidedIPX =
    nuxt.options.serverHandlers.find(handler => handler.route?.startsWith(ipxBaseURL)) ||
    nuxt.options.devServerHandlers.find(handler => handler.route?.startsWith(ipxBaseURL))
  if (hasUserProvidedIPX) {
    return
  }

  // Options
  const absoluteDir = await getDevDirs(nuxt, moduleOptions)
  const relativeDir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
  const ipxOptions: IPXRuntimeConfig = {
    ...providerOptions.options,
    baseURL: ipxBaseURL,
    alias: {
      ...moduleOptions.alias,
      ...providerOptions.options?.alias
    },
    fs: (providerOptions.options?.fs !== false) && {
      dir: nuxt.options.dev ? absoluteDir : relativeDir,
      ...providerOptions.options?.fs
    },
    http: (providerOptions.options?.http !== false) && {
      domains: moduleOptions.domains,
      ...providerOptions.options?.http
    }
  }

  nitro.options._config.runtimeConfig = nitro.options._config.runtimeConfig || {}
  nitro.options.runtimeConfig.ipx = ipxOptions

  const ipxHandler = <NitroEventHandler>{
    route: `${ipxBaseURL}/**`,
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

async function getDevDirs (nuxt: Nuxt, moduleOptions: Parameters<ProviderSetup>[1]) {
  let fs: { existsSync: (path: string) => boolean }
  try {
    // IPX is available in node context only
    // Therefore it should be safe to require fs
    fs = await import('node:fs')
  } catch (err) {
    // Fall back to previous behavior of resolving only the root public dir
    return [resolve(nuxt.options.srcDir, moduleOptions.dir || nuxt.options.dir.public)]
  }

  return nuxt.options._layers.map((layer) => {
    const isRootLayer = layer.config.rootDir === nuxt.options.rootDir
    const layerOptions = isRootLayer ? nuxt.options : layer.config
    const path = isRootLayer ? moduleOptions.dir : layerOptions.dir?.public || 'public'

    return resolve(layerOptions.srcDir, path)
  }).filter(dir => fs.existsSync(dir))
}

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    ipx?: IPXRuntimeConfig
  }
}
