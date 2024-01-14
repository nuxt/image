import { fileURLToPath } from 'node:url'
import { createIPX, createIPXH3Handler, ipxFSStorage, ipxHttpStorage } from 'ipx'
import type { IPXOptions } from 'ipx'
import { lazyEventHandler, useBase } from 'h3'
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
    httpStorage
  }

  const ipx = createIPX(ipxOptions)

  const ipxHandler = createIPXH3Handler(ipx)
  return useBase(opts.baseURL, ipxHandler)
})
