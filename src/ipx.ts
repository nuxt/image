import { arch, platform } from 'node:os'
import { readdir } from 'node:fs/promises'
import { join, relative } from 'pathe'
import { useNuxt, createResolver, useNitro, useLogger } from '@nuxt/kit'
import type { ProviderSetup } from './types'
import type { IPXRuntimeConfig } from './runtime/providers/ipx'
import { hasUserProvidedHandler, registerSelfHostedHandler } from './self-hosted'

type IPXSetupT = (setupOptions?: { isStatic: boolean }) => ProviderSetup

export const ipxSetup: IPXSetupT = setupOptions => (providerOptions, moduleOptions) => {
  const resolver = createResolver(import.meta.url)
  const nitro = useNitro()
  const nuxt = useNuxt()

  const ipxBaseURL = providerOptions.options?.baseURL || '/_ipx'

  // Avoid overriding user custom handler
  if (hasUserProvidedHandler(nuxt, ipxBaseURL)) {
    return
  }

  // Options
  const relativeDir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
  const ipxOptions: IPXRuntimeConfig = {
    ...providerOptions.options,
    baseURL: ipxBaseURL,
    alias: {
      ...moduleOptions.alias,
      ...providerOptions.options?.alias,
    },
    fs: (providerOptions.options?.fs !== false) && {
      dir: nuxt.options.dev ? moduleOptions.dirs : relativeDir,
      ...providerOptions.options?.fs,
    },
    http: (providerOptions.options?.http !== false) && {
      domains: moduleOptions.domains,
      ...providerOptions.options?.http,
    },
  }

  registerSelfHostedHandler(nitro, {
    baseURL: ipxBaseURL,
    runtimeConfigKey: 'ipx',
    handler: resolver.resolve('./runtime/server/routes/_ipx'),
    runtimeOptions: ipxOptions,
    prerenderOptions: { fs: { dir: moduleOptions.dirs } },
    isStatic: setupOptions?.isStatic,
  })

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
