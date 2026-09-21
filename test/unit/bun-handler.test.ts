import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { createApp, toWebHandler } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeImage } from './bun-fake-image'
import type { FakeImageOptions } from './bun-fake-image'
import { createBunImageHandler, negotiateFormat } from '../../src/runtime/server/bun/handler'
import type { BunImageRuntimeConfig } from '../../src/runtime/server/bun/utils'
import { resetUnsupportedBunModifierWarnings } from '../../src/runtime/utils/bun-modifiers'

const publicDir = fileURLToPath(new URL('../../playground/public', import.meta.url))

function setup(config: Partial<BunImageRuntimeConfig> = {}, image: FakeImageOptions = {}) {
  const fake = createFakeImage({ width: 5184, height: 3456, format: 'jpeg', ...image })
  const log = vi.fn()
  const handler = createBunImageHandler({
    baseURL: '/_bun',
    fs: { dir: publicDir, maxAge: 30 },
    alias: { unsplash: 'https://images.unsplash.com' },
    ...config,
  }, fake.Image, { log })
  const app = createApp()
  app.use(handler)
  const webHandler = toWebHandler(app)
  const request = (path: string, init: RequestInit = {}) => webHandler(new Request(`http://localhost${path}`, init))
  return { ...fake, log, request }
}

describe('bun provider: h3 handler', () => {
  beforeEach(() => {
    resetUnsupportedBunModifierWarnings()
  })

  it('resizes a local image and sets the security and cache headers', async () => {
    const { request, calls } = setup()
    const res = await request('/_bun/s_300x300&f_webp/images/colors.jpg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/webp')
    expect(res.headers.get('content-security-policy')).toBe('default-src \'none\'')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    expect(res.headers.get('cache-control')).toBe('max-age=30, public, s-maxage=30')
    expect(res.headers.get('last-modified')).toMatch(/GMT$/)
    expect(res.headers.get('etag')).toMatch(/^W\/"/)
    expect(await res.text()).toMatch(/^fake-webp-/)
    expect(calls.find(c => c.method === 'resize')!.args).toEqual([450, 300, { fit: 'fill', withoutEnlargement: false }])
  })

  it('answers 304 for a matching ETag or if-modified-since without processing', async () => {
    const { request, calls } = setup()
    const first = await request('/_bun/w_100/images/colors.jpg')
    const etag = first.headers.get('etag')!
    calls.length = 0
    const second = await request('/_bun/w_100/images/colors.jpg', { headers: { 'if-none-match': etag } })
    expect(second.status).toBe(304)
    expect(calls).toEqual([])
    const third = await request('/_bun/w_100/images/colors.jpg', { headers: { 'if-modified-since': new Date(Date.now() + 60_000).toUTCString() } })
    expect(third.status).toBe(304)
    expect(calls).toEqual([])
  })

  it('serves SVG untouched and warns once about ignored modifiers', async () => {
    const { request, log } = setup()
    const res = await request('/_bun/w_100/images/tacos.svg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/svg+xml')
    expect(await res.text()).toContain('<svg')
    await request('/_bun/w_200/images/tacos.svg')
    expect(log.mock.calls.filter(c => String(c[0]).includes('SVG sources are served unmodified'))).toHaveLength(1)
  })

  it('negotiates f_auto against the Accept header and varies on it', async () => {
    const { request, calls } = setup()
    const res = await request('/_bun/f_auto&w_10/images/colors.jpg', { headers: { accept: 'image/avif,image/webp,*/*' } })
    expect(res.headers.get('vary')).toBe('Accept')
    expect(res.headers.get('content-type')).toBe('image/avif')
    expect(calls.map(c => c.method)).toContain('avif')
    calls.length = 0
    const webp = await request('/_bun/f_auto&w_10/images/colors.jpg', { headers: { accept: 'image/webp' } })
    expect(webp.headers.get('content-type')).toBe('image/webp')
    const plain = await request('/_bun/f_auto&w_10/images/colors.jpg', { headers: { accept: 'image/*' } })
    expect(plain.headers.get('content-type')).toBe('image/jpeg')
  })

  it('falls back from avif when the machine cannot encode it, and stops offering it to f_auto', async () => {
    const { request, log } = setup({}, { unsupportedFormats: ['avif'] })
    const res = await request('/_bun/f_avif&w_10/images/colors.jpg')
    expect(res.headers.get('content-type')).toBe('image/webp')
    expect(log.mock.calls.some(c => String(c[0]).includes('cannot encode "avif"'))).toBe(true)
    const auto = await request('/_bun/f_auto&w_10/images/colors.jpg', { headers: { accept: 'image/avif,image/webp' } })
    expect(auto.headers.get('content-type')).toBe('image/webp')
  })

  it('warns about unsupported modifiers and still serves the image', async () => {
    const { request, log, calls } = setup()
    const res = await request('/_bun/blur_5&w_10/images/colors.jpg')
    expect(res.status).toBe(200)
    expect(calls.map(c => c.method)).toEqual(['resize', 'jpeg', 'blob'])
    expect(log.mock.calls.some(c => String(c[0]).includes('The "blur" modifier is not supported'))).toBe(true)
  })

  it('rejects unsupported modifiers with the error policy', async () => {
    const { request } = setup({ unsupported: 'error' })
    const res = await request('/_bun/blur_5&w_10/images/colors.jpg')
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('blur')
  })

  it('stays quiet with the silent policy', async () => {
    const { request, log } = setup({ unsupported: 'silent' })
    await request('/_bun/blur_5&w_10/images/tacos.svg')
    await request('/_bun/blur_5&w_10/images/colors.jpg')
    expect(log).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid modifiers and 404 for missing files', async () => {
    const { request } = setup()
    expect((await request('/_bun/w_0/images/colors.jpg')).status).toBe(400)
    expect((await request('/_bun/rotate_45/images/colors.jpg')).status).toBe(400)
    expect((await request('/_bun/w_10/images/missing.jpg')).status).toBe(404)
    // `..` is normalised away by URL parsing, leaving no id
    expect((await request('/_bun/w_10/../package.json')).status).toBe(400)
    expect((await request('/_bun/w_10/%2e%2e/package.json')).status).toBe(400)
    expect((await request('/_bun/')).status).toBe(400)
  })

  it('resolves aliases through the http storage', async () => {
    const http = { name: 'http', resolve: vi.fn(async () => ({ mtime: undefined, maxAge: 10, read: async () => new Uint8Array([1, 2, 3]) })) }
    const fake = createFakeImage()
    const handler = createBunImageHandler({ baseURL: '/_bun', alias: { '/unsplash': 'https://images.unsplash.com' }, fs: false }, fake.Image, { storages: { http }, log: vi.fn() })
    const app = createApp()
    app.use(handler)
    const res = await toWebHandler(app)(new Request('http://localhost/_bun/w_10/unsplash/photo-1'))
    expect(http.resolve).toHaveBeenCalledWith('https://images.unsplash.com/photo-1')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/octet-stream')
    expect(res.headers.get('cache-control')).toBe('max-age=10, public, s-maxage=10')
  })

  it('derives an ETag from the bytes when the source has no mtime and answers 304 with it', async () => {
    const jpeg = await readFile(`${publicDir}/images/colors.jpg`)
    const http = { name: 'http', resolve: vi.fn(async () => ({ mtime: undefined, maxAge: 10, read: async () => new Uint8Array(jpeg) })) }
    const fake = createFakeImage({ width: 5184, height: 3456 })
    const handler = createBunImageHandler({ baseURL: '/_bun', fs: false }, fake.Image, { storages: { http }, log: vi.fn() })
    const app = createApp()
    app.use(handler)
    const web = toWebHandler(app)
    const first = await web(new Request('http://localhost/_bun/w_10/https://example.com/a.jpg'))
    const etag = first.headers.get('etag')!
    expect(etag).toMatch(/^"/)
    const second = await web(new Request('http://localhost/_bun/w_10/https://example.com/a.jpg', { headers: { 'if-none-match': etag } }))
    expect(second.status).toBe(304)
  })

  it('refuses to start without any storage', () => {
    const fake = createFakeImage()
    expect(() => createBunImageHandler({ baseURL: '/_bun', fs: false, http: false }, fake.Image, { log: vi.fn() })).toThrowError(/no image storage/)
  })

  it('logs the detected fit modes once at startup', () => {
    const { log } = setup()
    expect(log).toHaveBeenCalledOnce()
    expect(log.mock.calls[0]![0]).toContain('native fit modes fill, inside')
  })
})

describe('bun provider: format negotiation', () => {
  it('prefers avif, then webp, then nothing', () => {
    expect(negotiateFormat('image/avif,image/webp,*/*', new Set())).toBe('avif')
    expect(negotiateFormat('image/webp,*/*', new Set())).toBe('webp')
    expect(negotiateFormat('image/avif,image/webp', new Set(['avif']))).toBe('webp')
    expect(negotiateFormat('*/*', new Set())).toBeUndefined()
    expect(negotiateFormat(undefined, new Set())).toBeUndefined()
  })
})
