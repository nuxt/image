import { fileURLToPath } from 'node:url'

import { createIPX, createIPXFetchHandler, parseIPXURL, ipxFSStorage, ipxHttpStorage } from 'ipx'
import type { IPXOptions } from 'ipx'
import { isAbsolute } from 'pathe'
import { withoutBase } from 'ufo'
import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'

import type { IPXRuntimeConfig } from '../../providers/ipx'

let fetchHandler: ReturnType<typeof createIPXFetchHandler> | undefined

export default defineEventHandler((event) => {
  fetchHandler ||= createHandler()
  return fetchHandler(event.req)
})

function createHandler() {
  const config = useRuntimeConfig()
  const opts = config.ipx as IPXRuntimeConfig || {} as Record<string, never>

  // Nitro v3 exposes the server entry as `__nitro_main__`; `import.meta.url` is the URL of this chunk
  const serverEntry = (globalThis as { __nitro_main__?: string }).__nitro_main__ || import.meta.url

  // TODO: Migrate to unstorage layer
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map(dir => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, serverEntry))) : undefined

  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : undefined
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : undefined
  if (!fsStorage && !httpStorage) {
    throw new Error('IPX storage is not configured!')
  }

  const ipxOptions: IPXOptions = {
    ...opts,
    storage: (fsStorage || httpStorage)!,
    httpStorage,
  }

  const baseURL = (opts.baseURL || '/_ipx').replace(/\/+$/, '')
  const ipx = createIPX(ipxOptions)
  return createIPXFetchHandler(ipx, {
    parseURL(url) {
      const parsedURL = new URL(url)
      let pathname = withoutBase(parsedURL.pathname, config.app.baseURL)
      if (baseURL && (pathname === baseURL || pathname.startsWith(`${baseURL}/`))) {
        pathname = pathname.slice(baseURL.length) || '/'
      }
      return parseIPXURL(parsedURL.origin + pathname + parsedURL.search)
    },
  })
}
