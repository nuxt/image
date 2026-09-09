import { fileURLToPath } from 'node:url'
import { mkdtemp, symlink, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFSStorage, createHTTPStorage, isInsideDir, resolveStorage } from '../../src/runtime/server/bun/storage'
import { BunImageError } from '../../src/runtime/server/bun/utils'

const publicDir = fileURLToPath(new URL('../../playground/public', import.meta.url))

describe('bun provider: filesystem storage', () => {
  it('serves files below the configured dir with mtime and maxAge', async () => {
    const storage = createFSStorage({ dir: publicDir, maxAge: 42 })
    const source = await storage.resolve('/images/colors.jpg')
    expect(source.mtime).toBeInstanceOf(Date)
    expect(source.maxAge).toBe(42)
    const bytes = await source.read()
    expect(bytes.length).toBeGreaterThan(1000)
    expect([...bytes.subarray(0, 3)]).toEqual([0xFF, 0xD8, 0xFF])
  })

  it('searches multiple dirs in order', async () => {
    const storage = createFSStorage({ dir: [join(publicDir, 'nope'), publicDir] })
    await expect(storage.resolve('/images/colors.jpg')).resolves.toBeTruthy()
  })

  it('returns 404 for missing files and directories', async () => {
    const storage = createFSStorage({ dir: publicDir })
    await expect(storage.resolve('/images/missing.jpg')).rejects.toMatchObject({ statusCode: 404, code: 'BUN_IMAGE_FILE_NOT_FOUND' })
    await expect(storage.resolve('/images')).rejects.toMatchObject({ statusCode: 404 })
  })

  it('rejects path traversal and invalid characters', async () => {
    const storage = createFSStorage({ dir: publicDir })
    await expect(storage.resolve('/../package.json')).rejects.toMatchObject({ statusCode: 403, code: 'BUN_IMAGE_FORBIDDEN_PATH' })
    await expect(storage.resolve('/images/../../package.json')).rejects.toMatchObject({ statusCode: 403 })
    await expect(storage.resolve('/images/a?b.jpg')).rejects.toMatchObject({ statusCode: 403 })
  })

  it('rejects symlinks that escape the dir unless allowed', async () => {
    const root = await mkdtemp(join(tmpdir(), 'nuxt-image-bun-'))
    const inside = join(root, 'public')
    await mkdir(inside)
    await writeFile(join(root, 'secret.txt'), 'secret')
    await writeFile(join(inside, 'ok.txt'), 'ok')
    await symlink(join(root, 'secret.txt'), join(inside, 'link.txt'))

    const strict = createFSStorage({ dir: inside })
    await expect(strict.resolve('/ok.txt')).resolves.toBeTruthy()
    await expect(strict.resolve('/link.txt')).rejects.toMatchObject({ statusCode: 403, code: 'BUN_IMAGE_FORBIDDEN_SYMLINK' })

    const relaxed = createFSStorage({ dir: inside, allowSymlinksOutsideDir: true })
    expect(new TextDecoder().decode(await (await relaxed.resolve('/link.txt')).read())).toBe('secret')
  })

  it('isInsideDir is strict about siblings and the dir itself', () => {
    expect(isInsideDir('/srv/public/a.png', '/srv/public')).toBe(true)
    expect(isInsideDir('/srv/public', '/srv/public')).toBe(false)
    expect(isInsideDir('/srv/public-other/a.png', '/srv/public')).toBe(false)
    expect(isInsideDir('/srv/a.png', '/srv/public')).toBe(false)
    expect(isInsideDir('/srv/public/..foo', '/srv/public')).toBe(true)
  })
})

describe('bun provider: http storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function stubFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
    const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) => handler(String(input), init))
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  }

  it('fetches allowlisted hosts and reads cache headers', async () => {
    const fetchMock = stubFetch(() => new Response(new Uint8Array([1, 2, 3]), {
      headers: { 'last-modified': 'Wed, 21 Oct 2015 07:28:00 GMT', 'cache-control': 'public, max-age=600' },
    }))
    const storage = createHTTPStorage({ domains: ['https://images.unsplash.com', 'example.com'] })
    const source = await storage.resolve('https://images.unsplash.com/photo.jpg')
    expect(source.mtime?.toUTCString()).toBe('Wed, 21 Oct 2015 07:28:00 GMT')
    expect(source.maxAge).toBe(600)
    expect([...await source.read()]).toEqual([1, 2, 3])
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ redirect: 'manual' })
  })

  it('uses the default maxAge when cache-control is absent or ignored', async () => {
    stubFetch(() => new Response('x', { headers: { 'cache-control': 'max-age=5' } }))
    expect((await createHTTPStorage({ domains: 'example.com', maxAge: 99, ignoreCacheControl: true }).resolve('https://example.com/a')).maxAge).toBe(99)
    stubFetch(() => new Response('x'))
    expect((await createHTTPStorage({ domains: 'example.com' }).resolve('https://example.com/a')).maxAge).toBe(300)
  })

  it('rejects hosts outside the allowlist, bad protocols and invalid URLs', async () => {
    const fetchMock = stubFetch(() => new Response('x'))
    const storage = createHTTPStorage({ domains: ['example.com'] })
    await expect(storage.resolve('https://evil.example.net/a')).rejects.toMatchObject({ statusCode: 403, code: 'BUN_IMAGE_FORBIDDEN_HOST' })
    await expect(storage.resolve('ftp://example.com/a')).rejects.toMatchObject({ statusCode: 403, code: 'BUN_IMAGE_FORBIDDEN_PROTOCOL' })
    await expect(storage.resolve('not a url')).rejects.toMatchObject({ statusCode: 400, code: 'BUN_IMAGE_INVALID_URL' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('allows any host with allowAllDomains', async () => {
    stubFetch(() => new Response('x'))
    await expect(createHTTPStorage({ allowAllDomains: true }).resolve('https://anything.test/a')).resolves.toBeTruthy()
  })

  it('follows redirects only within the allowlist', async () => {
    const fetchMock = stubFetch((url) => {
      if (url === 'https://example.com/a') {
        return new Response(null, { status: 302, headers: { location: '/b' } })
      }
      if (url === 'https://example.com/b') {
        return new Response(null, { status: 301, headers: { location: 'https://cdn.example.com/c' } })
      }
      return new Response('final')
    })
    const storage = createHTTPStorage({ domains: ['example.com', 'cdn.example.com'] })
    expect(new TextDecoder().decode(await (await storage.resolve('https://example.com/a')).read())).toBe('final')
    expect(fetchMock).toHaveBeenCalledTimes(3)

    const strict = createHTTPStorage({ domains: ['example.com'] })
    await expect(strict.resolve('https://example.com/a')).rejects.toMatchObject({ statusCode: 403, code: 'BUN_IMAGE_FORBIDDEN_HOST' })
  })

  it('sends configured credentials to the original origin only', async () => {
    const seen: Record<string, string | null>[] = []
    stubFetch((url, init) => {
      const headers = new Headers(init?.headers)
      seen.push({ url, authorization: headers.get('authorization'), cookie: headers.get('cookie'), accept: headers.get('accept') })
      if (url === 'https://example.com/a') {
        return new Response(null, { status: 302, headers: { location: '/b' } })
      }
      if (url === 'https://example.com/b') {
        return new Response(null, { status: 302, headers: { location: 'https://cdn.example.com/c' } })
      }
      return new Response('final')
    })
    const storage = createHTTPStorage({
      domains: ['example.com', 'cdn.example.com'],
      fetchOptions: { headers: { authorization: 'Bearer secret', cookie: 'session=1', accept: 'image/*' } },
    })
    await storage.resolve('https://example.com/a')
    expect(seen).toEqual([
      { url: 'https://example.com/a', authorization: 'Bearer secret', cookie: 'session=1', accept: 'image/*' },
      { url: 'https://example.com/b', authorization: 'Bearer secret', cookie: 'session=1', accept: 'image/*' },
      { url: 'https://cdn.example.com/c', authorization: null, cookie: null, accept: 'image/*' },
    ])
  })

  it('never sends configured credentials over plain HTTP', async () => {
    const seen: (string | null)[] = []
    stubFetch((_url, init) => {
      seen.push(new Headers(init?.headers).get('authorization'))
      return new Response('x')
    })
    const storage = createHTTPStorage({ domains: ['example.com'], fetchOptions: { headers: { authorization: 'Bearer secret' } } })
    await storage.resolve('http://example.com/a')
    await storage.resolve('https://example.com/a')
    expect(seen).toEqual([null, 'Bearer secret'])
  })

  it('gives up after too many redirects', async () => {
    stubFetch(() => new Response(null, { status: 302, headers: { location: '/loop' } }))
    await expect(createHTTPStorage({ domains: 'example.com' }).resolve('https://example.com/a')).rejects.toMatchObject({ code: 'BUN_IMAGE_TOO_MANY_REDIRECTS' })
  })

  it('maps upstream 404 and other failures', async () => {
    stubFetch(() => new Response(null, { status: 404 }))
    await expect(createHTTPStorage({ domains: 'example.com' }).resolve('https://example.com/a')).rejects.toMatchObject({ statusCode: 404 })
    stubFetch(() => new Response(null, { status: 500 }))
    await expect(createHTTPStorage({ domains: 'example.com' }).resolve('https://example.com/a')).rejects.toMatchObject({ statusCode: 502, code: 'BUN_IMAGE_FETCH_FAILED' })
    stubFetch(() => {
      throw new Error('boom')
    })
    await expect(createHTTPStorage({ domains: 'example.com' }).resolve('https://example.com/a')).rejects.toMatchObject({ statusCode: 502 })
  })
})

describe('bun provider: storage resolution', () => {
  const fs = { name: 'fs', resolve: vi.fn() }
  const http = { name: 'http', resolve: vi.fn() }

  it('applies aliases and picks http for absolute URLs', () => {
    const resolved = resolveStorage('/unsplash/photo-1', { fs, http, alias: { '/unsplash': 'https://images.unsplash.com' } })
    expect(resolved).toEqual({ id: 'https://images.unsplash.com/photo-1', storage: http })
  })

  it('adds a leading slash and prefers fs for paths', () => {
    expect(resolveStorage('images/a.png', { fs, http })).toEqual({ id: '/images/a.png', storage: fs })
    expect(resolveStorage('images/a.png', { http })).toEqual({ id: '/images/a.png', storage: http })
    expect(resolveStorage('https://x.test/a.png', { fs })).toEqual({ id: 'https://x.test/a.png', storage: fs })
  })

  it('throws without any storage', () => {
    expect(() => resolveStorage('/a.png', {})).toThrowError(BunImageError)
  })
})
