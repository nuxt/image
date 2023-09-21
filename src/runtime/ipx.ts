import { fileURLToPath } from 'node:url'
import { createIPX, createIPXH3Handler, ipxFSStorage, ipxHttpStorage, IPXOptions } from 'ipx'
import { lazyEventHandler, useBase } from 'h3'
import { isAbsolute, join } from 'pathe'
import type { NitroRuntimeConfig } from 'nitropack'
import { useRuntimeConfig } from '#imports'

export default lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx as NitroRuntimeConfig['ipx'] || {} as Record<string, never>

  // TODO: Migrate to unstorage layer
  const fsDir = opts.fs?.dir ? isAbsolute(opts.fs.dir) ? opts.fs.dir : fileURLToPath(new URL(opts.fs.dir, import.meta.url)) : undefined

  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : undefined
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : undefined
  if (!fsStorage && !httpStorage) {
    throw new Error('IPX storage is not configured!')
  }

  const ipxOptions: IPXOptions = {
    storage: (fsStorage || httpStorage)!,
    httpStorage
  }

  const ipx = createIPX(ipxOptions)

  const ipxHandler = createIPXH3Handler(ipx)
  return useBase(opts.baseURL, ipxHandler)
})
