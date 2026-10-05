import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { isAnimatedGif, isAnimatedWebP, sniffSource } from '../../src/runtime/server/bun/utils'

const publicDir = fileURLToPath(new URL('../../playground/public', import.meta.url))

function bytes(...values: (number | string)[]): Uint8Array {
  const out: number[] = []
  for (const value of values) {
    if (typeof value === 'string') {
      out.push(...[...value].map(c => c.charCodeAt(0)))
    }
    else {
      out.push(value)
    }
  }
  return Uint8Array.from(out)
}

describe('bun provider: source sniffing', () => {
  it('recognises the playground images', async () => {
    expect(sniffSource(await readFile(`${publicDir}/images/colors.jpg`))).toMatchObject({ kind: 'image', type: 'jpg', mimeType: 'image/jpeg', width: 5184 })
    expect(sniffSource(await readFile(`${publicDir}/images/nuxt.png`))).toMatchObject({ kind: 'image', type: 'png', mimeType: 'image/png' })
    expect(sniffSource(await readFile(`${publicDir}/images/tacos.svg`))).toMatchObject({ kind: 'svg', mimeType: 'image/svg+xml' })
  })

  it('detects the animation flag in WebP VP8X headers', () => {
    const header = (flags: number) => bytes('RIFF', 0, 0, 0, 0, 'WEBP', 'VP8X', 10, 0, 0, 0, flags, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    expect(isAnimatedWebP(header(0x02))).toBe(true)
    expect(isAnimatedWebP(header(0x10))).toBe(false)
    expect(isAnimatedWebP(bytes('RIFF', 0, 0, 0, 0, 'WEBP', 'VP8 ', 0, 0, 0, 0, 0, 0, 0, 0, 0))).toBe(false)
    expect(sniffSource(header(0x02)).kind).toBe('animated-webp')
  })

  it('detects animated GIFs by the NETSCAPE extension or multiple frames', () => {
    const gif1x1 = Uint8Array.from(atob('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), c => c.charCodeAt(0))
    expect(isAnimatedGif(gif1x1)).toBe(false)
    expect(sniffSource(gif1x1)).toMatchObject({ kind: 'image', type: 'gif' })
    const netscape = bytes('GIF89a', 1, 0, 1, 0, 0, 0, 0, 0x21, 0xFF, 0x0B, 'NETSCAPE2.0', 0x03, 0x01, 0x00, 0x00, 0x00, 0x3B)
    expect(isAnimatedGif(netscape)).toBe(true)
    expect(sniffSource(netscape).kind).toBe('animated-gif')
  })

  it('classifies AVIF and HEIC by ftyp brand', () => {
    const iso = (brand: string) => bytes(0, 0, 0, 0x1C, 'ftyp', brand, 0, 0, 0, 0, 'mif1', 'miaf', brand)
    expect(sniffSource(iso('avif'))).toMatchObject({ kind: 'avif', mimeType: 'image/avif' })
    expect(sniffSource(iso('heic'))).toMatchObject({ kind: 'heic' })
  })

  it('reports unknown data', () => {
    expect(sniffSource(bytes(1, 2, 3, 4))).toMatchObject({ kind: 'unknown', mimeType: 'application/octet-stream' })
  })
})
