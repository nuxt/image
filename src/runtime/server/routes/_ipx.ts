import { fileURLToPath } from 'node:url'

import { createIPX, createIPXFetchHandler, ipxFSStorage, ipxHttpStorage } from 'ipx'
import type { IPXOptions } from 'ipx'
import { lazyEventHandler, defineEventHandler, getRequestURL, sendWebResponse } from 'h3'
import { isAbsolute } from 'pathe'
import type { NitroRuntimeConfig } from 'nitropack'

import { useRuntimeConfig } from '#imports'

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

  const ipx = createIPX(ipxOptions)
  const _handler = createIPXFetchHandler(ipx)

  return defineEventHandler(async (event) => {
    // Get the path after the base URL (e.g., /_ipx)
    const url = getRequestURL(event)

    // Strip the base URL prefix from the pathname
    const baseURL = opts.baseURL || '/_ipx'
    let pathname = url.pathname
    if (pathname.startsWith(baseURL)) {
      pathname = pathname.slice(baseURL.length) || '/'
    }

    // Create a new URL with the stripped pathname for IPX
    const ipxURL = new URL(pathname + url.search, url.origin)

    // Create a request with the modified URL
    const request = new Request(ipxURL, {
      method: event.method,
      headers: event.headers,
    })

    const response = await _handler(request)
    return sendWebResponse(event, response)
  })
})
