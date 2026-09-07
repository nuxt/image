import { fileURLToPath } from 'node:url'

import { createIPX, createIPXFetchHandler, parseIPXURL, ipxFSStorage, ipxHttpStorage } from 'ipx'
import type { IPXOptions } from 'ipx'
import { fromWebHandler, lazyEventHandler } from 'h3'
import { isAbsolute } from 'pathe'
import type { NitroRuntimeConfig } from 'nitro/types'

import { useRuntimeConfig } from 'nitro/runtime-config'

export default lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx as NitroRuntimeConfig['ipx'] || {} as Record<string, never>

  // TODO: Migrate to unstorage layer
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map(dir => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, import.meta.url))) : undefined

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
  const fetchHandler = createIPXFetchHandler(ipx, {
    parseURL(url) {
      const parsedURL = new URL(url)
      let pathname = parsedURL.pathname
      if (baseURL && (pathname === baseURL || pathname.startsWith(`${baseURL}/`))) {
        pathname = pathname.slice(baseURL.length) || '/'
      }
      return parseIPXURL(parsedURL.origin + pathname + parsedURL.search)
    },
  })

  return fromWebHandler(async request => fetchHandler(request))
})
