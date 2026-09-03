import { stat, realpath, readFile } from 'node:fs/promises'
import { join, resolve, relative, isAbsolute } from 'pathe'
import { hasProtocol, joinURL, withLeadingSlash } from 'ufo'
import { BunImageError } from './utils'
import type { BunImageFSOptions, BunImageHTTPOptions } from './utils'

export interface ResolvedSource {
  /** Modification time of the source, used for `last-modified` and ETags. */
  mtime?: Date
  /** `max-age` in seconds this source may be cached for. */
  maxAge?: number
  /** Read the source bytes. Called at most once per request. */
  read: () => Promise<Uint8Array>
}

export interface ImageStorage {
  name: string
  resolve: (id: string) => Promise<ResolvedSource>
}

const NOT_IN_THIS_DIR = new Set(['ENOENT', 'ENOTDIR', 'ELOOP', 'ENAMETOOLONG'])

/** Whether `filePath` lives strictly below `dir`. Both must be absolute. */
export function isInsideDir(filePath: string, dir: string): boolean {
  const rel = relative(dir, filePath)
  return rel !== '' && rel !== '..' && !rel.startsWith('../') && !isAbsolute(rel)
}

function isValidPath(filePath: string): boolean {
  return !/["*:<>?|]/.test(filePath.replace(/^[a-z]:/i, ''))
}

export function createFSStorage(options: BunImageFSOptions = {}): ImageStorage {
  const dirs = (Array.isArray(options.dir) ? options.dir : [options.dir || '.']).map(dir => resolve(dir))
  const allowSymlinksOutsideDir = options.allowSymlinksOutsideDir ?? false
  const realDirs = new Map<string, Promise<string>>()
  const getRealDir = (dir: string) => {
    let real = realDirs.get(dir)
    if (!real) {
      real = realpath(dir).catch(() => dir)
      realDirs.set(dir, real)
    }
    return real
  }

  return {
    name: 'bun:fs',
    async resolve(id) {
      for (const dir of dirs) {
        const filePath = join(dir, id)
        if (!isValidPath(filePath) || !isInsideDir(filePath, dir)) {
          throw new BunImageError(403, 'BUN_IMAGE_FORBIDDEN_PATH', `Forbidden path: ${id}`)
        }
        let stats: Awaited<ReturnType<typeof stat>>
        let realPath: string | undefined
        try {
          stats = await stat(filePath)
          if (stats.isFile() && !allowSymlinksOutsideDir) {
            realPath = await realpath(filePath)
          }
        }
        catch (error: any) {
          if (NOT_IN_THIS_DIR.has(error?.code)) {
            continue
          }
          throw new BunImageError(403, 'BUN_IMAGE_FORBIDDEN_FILE', `Cannot access file: ${id}`, { cause: error })
        }
        if (!stats.isFile()) {
          continue
        }
        if (realPath !== undefined) {
          let realDir = await getRealDir(dir)
          if (!isInsideDir(realPath, realDir)) {
            // `dir` may be a repointed symlink
            realDirs.delete(dir)
            realDir = await getRealDir(dir)
          }
          if (!isInsideDir(realPath, realDir)) {
            throw new BunImageError(403, 'BUN_IMAGE_FORBIDDEN_SYMLINK', `Forbidden symlink: ${id}`)
          }
        }
        const target = realPath ?? filePath
        return {
          mtime: stats.mtime,
          maxAge: options.maxAge,
          read: async () => new Uint8Array(await readFile(target)),
        }
      }
      throw new BunImageError(404, 'BUN_IMAGE_FILE_NOT_FOUND', `File not found: ${id}`)
    },
  }
}

const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308])
const MAX_REDIRECTS = 3
const CREDENTIAL_HEADERS = ['authorization', 'proxy-authorization', 'cookie']

function parseMaxAge(cacheControl: string | null): number | undefined {
  const match = cacheControl?.match(/(?:^|,)\s*(?:s-maxage|max-age)\s*=\s*(\d+)/i)
  return match ? Number.parseInt(match[1]!, 10) : undefined
}

export function createHTTPStorage(options: BunImageHTTPOptions = {}): ImageStorage {
  const allowAllDomains = options.allowAllDomains ?? false
  const domainList = typeof options.domains === 'string' ? options.domains.split(',').map(d => d.trim()) : (options.domains || [])
  const domains = new Set(domainList.filter(Boolean).map((domain) => {
    const withProtocol = /^https?:\/\//.test(domain) ? domain : `http://${domain}`
    try {
      return new URL(withProtocol).hostname
    }
    catch {
      return domain
    }
  }))
  const defaultMaxAge = options.maxAge ?? 300
  const fetchOptions = options.fetchOptions || {}

  // credentials configured in fetchOptions are only sent to the original origin
  function headersFor(sameOrigin: boolean): Headers | undefined {
    if (!fetchOptions.headers) {
      return undefined
    }
    const headers = new Headers(fetchOptions.headers)
    if (!sameOrigin) {
      for (const name of CREDENTIAL_HEADERS) {
        headers.delete(name)
      }
    }
    return headers
  }

  function validate(url: URL, id: string) {
    if (!url.hostname) {
      throw new BunImageError(403, 'BUN_IMAGE_MISSING_HOSTNAME', `Hostname is missing: ${id}`)
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new BunImageError(403, 'BUN_IMAGE_FORBIDDEN_PROTOCOL', `Forbidden protocol: ${url.protocol}`)
    }
    if (!allowAllDomains && !domains.has(url.hostname)) {
      throw new BunImageError(403, 'BUN_IMAGE_FORBIDDEN_HOST', `Forbidden host: ${url.hostname}`)
    }
  }

  async function fetchValidated(id: string): Promise<Response> {
    let url: URL
    try {
      url = new URL(id)
    }
    catch {
      throw new BunImageError(400, 'BUN_IMAGE_INVALID_URL', `Invalid URL: ${id}`)
    }
    validate(url, id)

    // re-validate every redirect hop
    let current = url
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      let response: Response
      try {
        response = await fetch(current, { ...fetchOptions, headers: headersFor(current.origin === url.origin), redirect: 'manual' })
      }
      catch (error) {
        throw new BunImageError(502, 'BUN_IMAGE_FETCH_FAILED', `Cannot fetch: ${id}`, { cause: error })
      }
      if (REDIRECT_STATUS.has(response.status)) {
        const location = response.headers.get('location')
        await response.body?.cancel().catch(() => {})
        if (!location) {
          throw new BunImageError(502, 'BUN_IMAGE_FETCH_FAILED', `Redirect without location: ${id}`)
        }
        try {
          current = new URL(location, current)
        }
        catch {
          throw new BunImageError(502, 'BUN_IMAGE_FETCH_FAILED', `Invalid redirect: ${id}`)
        }
        validate(current, id)
        continue
      }
      if (response.status === 404) {
        await response.body?.cancel().catch(() => {})
        throw new BunImageError(404, 'BUN_IMAGE_RESOURCE_NOT_FOUND', `Resource not found: ${id}`)
      }
      if (!response.ok) {
        await response.body?.cancel().catch(() => {})
        throw new BunImageError(502, 'BUN_IMAGE_FETCH_FAILED', `Upstream responded ${response.status}: ${id}`)
      }
      return response
    }
    throw new BunImageError(502, 'BUN_IMAGE_TOO_MANY_REDIRECTS', `Too many redirects: ${id}`)
  }

  return {
    name: 'bun:http',
    async resolve(id) {
      const response = await fetchValidated(id)
      const lastModified = response.headers.get('last-modified')
      const mtime = lastModified ? new Date(lastModified) : undefined
      const upstreamMaxAge = options.ignoreCacheControl ? undefined : parseMaxAge(response.headers.get('cache-control'))
      return {
        mtime: mtime && !Number.isNaN(mtime.getTime()) ? mtime : undefined,
        maxAge: upstreamMaxAge ?? defaultMaxAge,
        read: async () => new Uint8Array(await response.arrayBuffer()),
      }
    },
  }
}

export interface StorageSet {
  fs?: ImageStorage
  http?: ImageStorage
  alias?: Record<string, string>
}

/** Apply aliases and pick the storage for an id, following ipx's rules. */
export function resolveStorage(rawId: string, storages: StorageSet): { id: string, storage: ImageStorage } {
  let id = hasProtocol(rawId) ? rawId : withLeadingSlash(rawId)

  for (const base in storages.alias || {}) {
    if (id.startsWith(base)) {
      id = joinURL(storages.alias![base]!, id.slice(base.length))
    }
  }

  const storage = hasProtocol(id)
    ? storages.http || storages.fs
    : storages.fs || storages.http
  if (!storage) {
    throw new BunImageError(500, 'BUN_IMAGE_NO_STORAGE', 'No storage configured')
  }
  return { id, storage }
}
