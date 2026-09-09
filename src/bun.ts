import process from 'node:process'
import { relative } from 'pathe'
import { useNuxt, createResolver, useNitro, useLogger } from '@nuxt/kit'
import type { ProviderSetup } from './types'
import type { BunImageRuntimeConfig } from './runtime/server/bun/utils'
import { hasUserProvidedHandler, registerSelfHostedHandler } from './self-hosted'

const BUN_MIN_VERSION = '1.4.0'

type BunSetupT = (setupOptions?: { isStatic: boolean }) => ProviderSetup

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(part => Number.parseInt(part, 10) || 0)
  const pb = b.split('.').map(part => Number.parseInt(part, 10) || 0)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) {
      return (pa[i] || 0) - (pb[i] || 0)
    }
  }
  return 0
}

/** Whether the current process is a Bun runtime that has `Bun.Image` (`bun --bun nuxt dev`, `bun --bun nuxt generate`). */
export function isSupportedBunRuntime(): boolean {
  const version = process.versions.bun
  return Boolean(version) && compareVersions(version!, BUN_MIN_VERSION) >= 0
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

  const onBun = isSupportedBunRuntime()
  if (process.versions.bun && !onBun) {
    logger.warn(`The \`bun\` image provider needs Bun >= ${BUN_MIN_VERSION}, found ${process.versions.bun}.`)
  }
  else if (nuxt.options.dev && !onBun) {
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
