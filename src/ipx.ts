import { arch, platform } from 'node:os'
import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, relative, resolve } from 'pathe'
import { useNuxt, createResolver, useNitro, useLogger } from '@nuxt/kit'
import type { NitroEventHandler } from 'nitropack'
import type { HTTPStorageOptions, NodeFSSOptions, IPXOptions } from 'ipx'
import { defu } from 'defu'
import { hasProtocol } from 'ufo'
import type { ProviderSetup } from './types'

export type IPXRuntimeConfig = Omit<IPXOptions, 'storage' | 'httpStorage'> & { http: HTTPStorageOptions, fs: NodeFSSOptions } & {
  baseURL: string
}

type IPXSetupT = (setupOptions?: { isStatic: boolean }) => ProviderSetup

export const ipxSetup: IPXSetupT = setupOptions => (providerOptions, moduleOptions) => {
  const resolver = createResolver(import.meta.url)
  const nitro = useNitro()
  const nuxt = useNuxt()

  const ipxBaseURL = providerOptions.options?.baseURL || '/_ipx'

  // Avoid overriding user custom handler
  const hasUserProvidedIPX = nuxt.options.serverHandlers.find(handler => handler.route?.startsWith(ipxBaseURL))
    || nuxt.options.devServerHandlers.find(handler => handler.route?.startsWith(ipxBaseURL))
    || hasProtocol(ipxBaseURL, { acceptRelative: true })

  if (hasUserProvidedIPX) {
    return
  }

  // Options
  const publicDirs = nuxt.options._layers.map((layer) => {
    const isRootLayer = layer.config.rootDir === nuxt.options.rootDir
    const layerOptions = isRootLayer ? nuxt.options : layer.config
    const path = isRootLayer ? moduleOptions.dir : layerOptions.dir?.public || 'public'

    return resolve(layerOptions.srcDir, path)
  }).filter(dir => existsSync(dir))
  const relativeDir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
  const ipxOptions: IPXRuntimeConfig = {
    ...providerOptions.options,
    baseURL: ipxBaseURL,
    alias: {
      ...moduleOptions.alias,
      ...providerOptions.options?.alias,
    },
    fs: (providerOptions.options?.fs !== false) && {
      dir: nuxt.options.dev ? publicDirs : relativeDir,
      ...providerOptions.options?.fs,
    },
    http: (providerOptions.options?.http !== false) && {
      domains: moduleOptions.domains,
      ...providerOptions.options?.http,
    },
  }

  nitro.options._config.runtimeConfig = nitro.options._config.runtimeConfig || {}
  nitro.options.runtimeConfig.ipx = ipxOptions

  const ipxHandler = <NitroEventHandler>{
    route: `${ipxBaseURL}/**`,
    middleware: false,
    handler: resolver.resolve('./runtime/server/routes/_ipx'),
  }

  if (!setupOptions?.isStatic) {
    nitro.options.handlers.push(ipxHandler)
  }

  // Prerenderer
  if (!nitro.options.dev) {
    nitro.options._config.runtimeConfig.ipx = defu({ fs: { dir: publicDirs } }, ipxOptions)
    nitro.options._config.handlers!.push(ipxHandler)
  }

  if (!nuxt.options.dev && !setupOptions?.isStatic) {
    nitro.hooks.hook('compiled', async () => {
      const logger = useLogger('@nuxt/image')
      const target = `${platform}-${arch}`
      const tracedFiles = await readdir(join(nitro.options.output.serverDir, 'node_modules/@img')).catch(() => [])
      if (!tracedFiles.length) {
        logger.warn(`\`sharp\` binaries for \`${target}\` cannot be found. Please report this as a bug with a reproduction at \`https://github.com/nuxt/image\`.`)
      }
      else {
        logger.info(`\`sharp\` binaries have been included in your build for \`${target}\`. Make sure you deploy to the same architecture.`)
        logger.debug(` - dependencies traced: ${tracedFiles.map(f => `@img/${f}`).join(', ')}`)
      }
    })
  }
}

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    ipx?: IPXRuntimeConfig
  }
}
