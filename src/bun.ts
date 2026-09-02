import process from 'node:process'
import { relative } from 'pathe'
import { useNuxt, createResolver, useNitro, useLogger } from '@nuxt/kit'
import type { ProviderSetup } from './types'
import type { BunImageRuntimeConfig } from './runtime/server/bun/utils'
import { hasUserProvidedHandler, registerSelfHostedHandler } from './self-hosted'

const BUN_MIN_VERSION = '1.4.0'

type BunSetupT = (setupOptions?: { isStatic: boolean }) => ProviderSetup

/** Whether the current process is Bun (`bun --bun nuxt dev`, `bun --bun nuxt generate`). */
function isRunningOnBun(): boolean {
  return Boolean(process.versions.bun)
}

export const bunSetup: BunSetupT = setupOptions => (providerOptions, moduleOptions) => {
  const resolver = createResolver(import.meta.url)
  const nitro = useNitro()
  const nuxt = useNuxt()
  const logger = useLogger('@nuxt/image')

  const baseURL = providerOptions.options?.baseURL || '/_bun'

  // Avoid overriding user custom handler
  if (hasUserProvidedHandler(nuxt, baseURL)) {
    return
  }

  const relativeDir = relative(nitro.options.output.serverDir, nitro.options.output.publicDir)
  const runtimeOptions: BunImageRuntimeConfig = {
    ...providerOptions.options,
    baseURL,
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
    baseURL,
    runtimeConfigKey: 'bunImage',
    handler: resolver.resolve('./runtime/server/routes/_bun'),
    runtimeOptions,
    prerenderOptions: { fs: { dir: moduleOptions.dirs } },
    isStatic: setupOptions?.isStatic,
  })

  const onBun = isRunningOnBun()
  if (nuxt.options.dev && !onBun) {
    logger.warn(`The \`bun\` image provider needs the Bun runtime (>= ${BUN_MIN_VERSION}). Start the dev server with \`bun --bun nuxt dev\`, or set \`image.provider\` to \`ipx\`.`)
  }
  else if (setupOptions?.isStatic && !onBun) {
    logger.warn(`The \`bunStatic\` image provider prerenders with Bun.Image, which needs the Bun runtime (>= ${BUN_MIN_VERSION}). Run \`bun --bun nuxt generate\`, or set \`image.provider\` to \`ipx\`.`)
  }
  else if (!nuxt.options.dev && !setupOptions?.isStatic && nitro.options.preset !== 'bun' && !onBun) {
    logger.info(`The \`bun\` image provider needs the server to run on Bun >= ${BUN_MIN_VERSION} (Nitro preset \`${nitro.options.preset}\`). Build with \`NITRO_PRESET=bun\` or make sure the server entry is started with Bun.`)
  }
}

declare module 'nitropack' {
  interface NitroRuntimeConfig {
    bunImage?: BunImageRuntimeConfig
  }
}
