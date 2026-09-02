import { fileURLToPath } from 'node:url'
import { lazyEventHandler, defineEventHandler, createError } from 'h3'
import { isAbsolute } from 'pathe'
import { createBunImageHandler } from '../bun/handler'
import type { BunImageConstructor } from '../bun/pipeline'
import type { BunImageRuntimeConfig } from '../bun/utils'

import { useRuntimeConfig } from '#imports'

const MIN_BUN_VERSION = '1.4.0'

interface BunGlobal {
  version?: string
  Image?: BunImageConstructor
  semver?: { satisfies: (version: string, range: string) => boolean }
}

function runtimeError(message: string) {
  return defineEventHandler(() => {
    throw createError({ statusCode: 500, statusMessage: 'BUN_IMAGE_RUNTIME_UNAVAILABLE', message })
  })
}

export default lazyEventHandler(() => {
  const config = (useRuntimeConfig().bunImage || {}) as BunImageRuntimeConfig

  const bun = (globalThis as { Bun?: BunGlobal }).Bun
  if (!bun?.Image) {
    return runtimeError(
      '[@nuxt/image] The bun provider needs the Bun runtime (>= 1.4.0) with Bun.Image. '
      + 'Start the dev server with `bun --bun nuxt dev`, build with the `bun` Nitro preset and run the server with Bun, '
      + 'or set `image.provider` to "ipx".',
    )
  }
  if (bun.semver && bun.version && !bun.semver.satisfies(bun.version, `>=${MIN_BUN_VERSION}`)) {
    return runtimeError(`[@nuxt/image] The bun provider needs Bun >= ${MIN_BUN_VERSION}, found ${bun.version}.`)
  }

  const fsDir = config.fs && config.fs.dir
    ? (Array.isArray(config.fs.dir) ? config.fs.dir : [config.fs.dir]).map(dir => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, import.meta.url)))
    : undefined

  return createBunImageHandler({
    ...config,
    fs: config.fs && fsDir ? { ...config.fs, dir: fsDir } : false,
  }, bun.Image)
})
