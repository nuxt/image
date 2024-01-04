import { fileURLToPath } from 'node:url'
import { createIPX, createIPXH3Handler, ipxHttpStorage, unstorageToIPXStorage as originalUnstorageToIPXStorage } from 'ipx'
import type { IPXOptions, IPXStorage, IPXStorageMeta } from 'ipx'
import { lazyEventHandler, useBase } from 'h3'
import { isAbsolute } from 'pathe'
import type { NitroRuntimeConfig } from 'nitropack'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { useRuntimeConfig } from '#imports'

// Copied from ipx source, removed prefix and fixed to work with unstorage keys
// Ref: https://github.com/unjs/ipx/blob/main/src/storage/unstorage.ts
export function unstorageToIPXStorage (
  // Storage and Driver are not exported from unstorage
  storage: Parameters<typeof originalUnstorageToIPXStorage>[0]
): IPXStorage {
  const resolveKey = (id: string) => id.replaceAll('/', ':')

  return {
    name: 'ipx:unstorage',
    async getMeta (id, opts = {}) {
      if (!storage.getMeta) {
        return
      }
      const storageKey = resolveKey(id)
      const meta = await storage.getMeta(storageKey, opts)
      return meta as IPXStorageMeta
    },
    async getData (id, opts = {}) {
      if (!storage.getItemRaw) {
        return
      }
      const storageKey = resolveKey(id)
      const data = await storage.getItemRaw(storageKey, opts)
      return data as ArrayBuffer
    }
  }
}

export default lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx as NitroRuntimeConfig['ipx'] || {} as Record<string, never>

  const fsDir = opts.fs?.dir ? isAbsolute(opts.fs.dir) ? opts.fs.dir : fileURLToPath(new URL(opts.fs.dir, import.meta.url)) : undefined
  const fsUnstorage = fsDir ? createStorage({ driver: fsDriver({ base: fsDir }) }) : undefined
  const fsStorage = fsUnstorage ? unstorageToIPXStorage(fsUnstorage) : undefined

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
