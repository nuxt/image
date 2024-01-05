import { fileURLToPath } from 'node:url'
import { createIPX, createIPXH3Handler, ipxHttpStorage, unstorageToIPXStorage as originalUnstorageToIPXStorage } from 'ipx'
import type { IPXOptions, IPXStorage, IPXStorageMeta } from 'ipx'
import { lazyEventHandler, useBase } from 'h3'
import { isAbsolute } from 'pathe'
import type { NitroRuntimeConfig } from 'nitropack'
import { createStorage, defineDriver } from 'unstorage'
import fsLiteDriver from 'unstorage/drivers/fs-lite'
import type { IPXRuntimeConfig } from '../ipx'
import { useRuntimeConfig } from '#imports'

// Storage and Driver are not exported from unstorage
type StorageOrDriver = Parameters<typeof originalUnstorageToIPXStorage>[0]

// Copied from ipx source, removed prefix and fixed to work with unstorage keys
// Ref: https://github.com/unjs/ipx/blob/main/src/storage/unstorage.ts
export function unstorageToIPXStorage (
  storage: StorageOrDriver
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

function combineUnstorages (storages: StorageOrDriver[]) {
  if (storages.length === 1) {
    // Nothing to combine
    return storages[0]
  }

  const combineDriver = defineDriver(options => ({
    name: 'combine',
    options,
    async getMeta (...params) {
      for (let i = 0; i < storages.length; ++i) {
        const storage = storages[i]
        const value = await storage.getMeta?.(...params)

        if (value?.mtime || i === storages.length - 1) {
          // We either found the value or this is the last storage
          return value ?? null
        }
      }

      // Should never reach here, because we return value from last storage
      // But typescript is not clever enough to understand that, yet
      return null
    },
    async getItemRaw (...params) {
      for (let i = 0; i < storages.length; ++i) {
        const storage = storages[i]
        const value = await storage.getItemRaw?.(...params)

        if (value || i === storages.length - 1) {
          // We either found the value or this is the last storage
          return value
        }
      }
    },
    // Stubs to satisfy type, IPX only requires getMeta and getItemRaw
    hasItem () { return false },
    getItem () { return null },
    getKeys () { return [] }
  }))

  return createStorage({ driver: combineDriver({}) })
}

function normalizeDir (dir: string) {
  if (isAbsolute(dir)) {
    return dir
  }

  return fileURLToPath(new URL(dir, import.meta.url))
}

function getFsStorage (opts: IPXRuntimeConfig) {
  const dirs = opts?.fs?.dirs

  if (!dirs || !dirs.length) {
    return undefined
  }

  const normalizedDirs = dirs.map(dir => normalizeDir(dir))
  const unstorages = normalizedDirs.map(dir => createStorage({ driver: fsLiteDriver({ base: dir }) }))

  return unstorageToIPXStorage(combineUnstorages(unstorages))
}

export default lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx as NitroRuntimeConfig['ipx'] || {} as Record<string, never>

  const fsStorage = getFsStorage(opts as IPXRuntimeConfig)
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
