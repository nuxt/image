import { describe, expect, it, beforeAll } from 'bun:test'
import { fileURLToPath } from 'node:url'
import { createApp, toWebHandler } from 'h3'
import { createBunImageHandler } from '../../src/runtime/server/bun/handler'
import type { BunImageRuntimeConfig } from '../../src/runtime/server/bun/utils'

const publicDir = fileURLToPath(new URL('../../playground/public', import.meta.url))

function setup(config: Partial<BunImageRuntimeConfig> = {}) {
  const logs: string[] = []
  const handler = createBunImageHandler({
    baseURL: '/_bun',
    fs: { dir: publicDir },
    http: { domains: ['images.unsplash.com'] },
    alias: { unsplash: 'https://images.unsplash.com' },
    ...config,
  }, Bun.Image as any, { log: message => logs.push(message) })
  const app = createApp()
  app.use(handler)
  const web = toWebHandler(app)
  const get = (path: string, headers: Record<string, string> = {}) => web(new Request(`http://localhost${path}`, { headers }))
  return { get, logs }
}

async function metadata(res: Response) {
  const bytes = new Uint8Array(await res.arrayBuffer())
  return { ...(await new Bun.Image(bytes).metadata()), bytes: bytes.length }
}

describe('bun provider: handler with real Bun.Image', () => {
  let get: ReturnType<typeof setup>['get']
  let logs: string[]

  beforeAll(() => {
    expect(Bun.semver.satisfies(Bun.version, '>=1.4.0')).toBe(true)
    ;({ get, logs } = setup())
  })

  it('resizes s_300x300 to a WebP that covers the box without cropping', async () => {
    const res = await get('/_bun/s_300x300&f_webp/images/colors.jpg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/webp')
    expect(res.headers.get('content-security-policy')).toBe('default-src \'none\'')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    expect(res.headers.get('cache-control')).toBe('max-age=60, public, s-maxage=60')
    expect(res.headers.get('etag')).toMatch(/^W\//)
    const meta = await metadata(res)
    expect(meta.format).toBe('webp')
    // 3:2 source covering 300x300 without a crop
    expect([meta.width, meta.height]).toEqual([450, 300])
  })

  it('handles width-only and height-only requests', async () => {
    expect(await metadata(await get('/_bun/w_300/images/colors.jpg'))).toMatchObject({ width: 300, height: 200, format: 'jpeg' })
    expect(await metadata(await get('/_bun/h_100/images/colors.jpg'))).toMatchObject({ width: 150, height: 100 })
  })

  it('applies inside and fill fits', async () => {
    expect(await metadata(await get('/_bun/s_300x300&fit_inside/images/colors.jpg'))).toMatchObject({ width: 300, height: 200 })
    expect(await metadata(await get('/_bun/s_300x300&fit_fill/images/colors.jpg'))).toMatchObject({ width: 300, height: 300 })
  })

  it('keeps PNG sources as PNG and re-encodes with encoder options', async () => {
    expect(await metadata(await get('/_bun/w_50/images/nuxt.png'))).toMatchObject({ width: 50, format: 'png' })
    const palette = await get('/_bun/w_50&palette&colors_16/images/nuxt.png')
    expect(palette.status).toBe(200)
  })

  it('serves SVG untouched', async () => {
    const res = await get('/_bun/w_50/images/tacos.svg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/svg+xml')
    expect(await res.text()).toContain('<svg')
  })

  it('rotates, flips and desaturates', async () => {
    expect(await metadata(await get('/_bun/w_100&rotate_90&flip&grayscale/images/colors.jpg'))).toMatchObject({ width: 100, height: 150 })
  })

  it('negotiates f_auto and falls back from avif where the OS cannot encode it', async () => {
    const res = await get('/_bun/f_auto&w_50/images/colors.jpg', { accept: 'image/avif,image/webp,*/*' })
    expect(res.status).toBe(200)
    expect(res.headers.get('vary')).toBe('Accept')
    const meta = await metadata(res)
    expect(['avif', 'webp']).toContain(meta.format)
    if (meta.format === 'webp') {
      expect(logs.some(l => l.includes('cannot encode "avif"'))).toBe(true)
    }
  })

  it('ignores unsupported modifiers with a warning and still serves the image', async () => {
    const res = await get('/_bun/w_50&blur_5/images/colors.jpg')
    expect(res.status).toBe(200)
    expect(await metadata(res)).toMatchObject({ width: 50 })
    expect(logs.some(l => l.includes('The "blur" modifier is not supported'))).toBe(true)
  })

  it('returns 400 with the error policy', async () => {
    const strict = setup({ unsupported: 'error' })
    expect((await strict.get('/_bun/w_50&blur_5/images/colors.jpg')).status).toBe(400)
  })

  it('maps bad input to 4xx', async () => {
    expect((await get('/_bun/rotate_45/images/colors.jpg')).status).toBe(400)
    expect((await get('/_bun/w_0/images/colors.jpg')).status).toBe(400)
    expect((await get('/_bun/w_10/images/nope.jpg')).status).toBe(404)
    // traversal is normalised away by URL parsing
    expect((await get('/_bun/w_10/%2e%2e/package.json')).status).toBe(400)
    expect((await get('/_bun/w_10/https://evil.test/a.jpg')).status).toBe(403)
  })

  it('clamps oversized output to maxOutputDimension', async () => {
    const res = await get('/_bun/s_20000x20000&enlarge&fit_fill/images/nuxt.png')
    expect(res.status).toBe(200)
    expect(await metadata(res)).toMatchObject({ width: 8192, height: 8192 })
  })

  it('answers 304 to a matching ETag', async () => {
    const first = await get('/_bun/w_100/images/colors.jpg')
    const etag = first.headers.get('etag')!
    const second = await get('/_bun/w_100/images/colors.jpg', { 'if-none-match': etag })
    expect(second.status).toBe(304)
  })

  it('serves animated WebP untouched', async () => {
    // VP8X header with the animation flag
    const header = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x58, 10, 0, 0, 0, 0x02, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const storage = { name: 'mem', resolve: async () => ({ mtime: undefined, maxAge: 1, read: async () => header }) }
    const handler = createBunImageHandler({ baseURL: '/_bun', fs: false }, Bun.Image as any, { storages: { fs: storage }, log: () => {} })
    const app = createApp()
    app.use(handler)
    const res = await toWebHandler(app)(new Request('http://localhost/_bun/w_10/anim.webp'))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/webp')
    expect((await res.arrayBuffer()).byteLength).toBe(header.length)
  })
})
