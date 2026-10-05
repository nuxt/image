import { describe, expect, it } from 'vitest'
import { createFakeImage } from './bun-fake-image'
import {
  clampToMaxDimension,
  defaultOutputFormat,
  detectNativeFits,
  fitDimensions,
  normalizeFormat,
  parseColor,
  parseModifiers,
  processImage,
} from '../../src/runtime/server/bun/pipeline'
import { BunImageError } from '../../src/runtime/server/bun/utils'

const source = new Uint8Array([1, 2, 3])

describe('bun provider: pipeline', () => {
  describe('parseModifiers', () => {
    it('reads sizes from resize, width and height with aliases', () => {
      expect(parseModifiers({ s: '300x200' })).toMatchObject({ width: 300, height: 200 })
      expect(parseModifiers({ s: '300' }).width).toBe(300)
      expect(parseModifiers({ s: '300' }).height).toBeUndefined()
      expect(parseModifiers({ w: '10', height: 20 })).toMatchObject({ width: 10, height: 20 })
    })

    it('validates numbers the way ipx does, since Bun accepts bad values silently', () => {
      expect(() => parseModifiers({ w: '0' })).toThrowError(BunImageError)
      expect(() => parseModifiers({ w: '-5' })).toThrowError(/at least 1/)
      expect(() => parseModifiers({ w: '10.5' })).toThrowError(/an integer/)
      expect(() => parseModifiers({ w: 'abc' })).toThrowError(/a number/)
      expect(() => parseModifiers({ q: '0' })).toThrowError(/at least 1/)
      expect(() => parseModifiers({ q: '101' })).toThrowError(/at most 100/)
      expect(() => parseModifiers({ fit: 'stretch' })).toThrowError(/Invalid value for modifier "fit"/)
      expect(() => parseModifiers({ kernel: 'bogus' })).toThrowError(/Invalid value for modifier "kernel"/)
      expect(() => parseModifiers({ rotate: '45' })).toThrowError(/multiple of 90/)
      expect(() => parseModifiers({ compressionLevel: '10' })).toThrowError(/at most 9/)
    })

    it('normalises rotation and formats', () => {
      expect(parseModifiers({ rotate: '-90' }).rotate).toBe(270)
      expect(parseModifiers({ rotate: '450' }).rotate).toBe(90)
      expect(parseModifiers({ f: 'jpg' }).format).toBe('jpeg')
      expect(parseModifiers({ f: 'heif' }).format).toBe('heic')
      expect(parseModifiers({ f: 'gif' })).toMatchObject({ format: undefined, requestedFormat: 'gif' })
    })

    it('handles flags, modulate and grayscale', () => {
      expect(parseModifiers({ flip: '', flop: 'true', enlarge: '' })).toMatchObject({ flip: true, flop: true, enlarge: true })
      expect(parseModifiers({ modulate: '1.2_0.5' })).toMatchObject({ brightness: 1.2, saturation: 0.5, notes: [] })
      expect(parseModifiers({ modulate: '1_1_90' }).notes[0]).toMatch(/hue and lightness/)
      expect(parseModifiers({ grayscale: '' }).saturation).toBe(0)
    })

    it('parses colours', () => {
      expect(parseColor('b', 'ff0000')).toEqual({ r: 255, g: 0, b: 0, alpha: 1 })
      expect(parseColor('b', '#0f8')).toEqual({ r: 0, g: 255, b: 136, alpha: 1 })
      expect(parseColor('b', '00000080').alpha).toBeCloseTo(0.5, 1)
      expect(parseColor('b', 'white')).toEqual({ r: 255, g: 255, b: 255, alpha: 1 })
      expect(() => parseColor('b', 'nope')).toThrowError(BunImageError)
    })
  })

  describe('helpers', () => {
    it('clamps dimensions preserving aspect ratio', () => {
      expect(clampToMaxDimension({ width: 20000, height: 10000 }, 8192)).toEqual({ width: 8192, height: 4096 })
      expect(clampToMaxDimension({ width: 100, height: 50 }, 8192)).toEqual({ width: 100, height: 50 })
      expect(clampToMaxDimension({ width: 20000 }, false)).toEqual({ width: 20000 })
    })

    it('computes inside and outside boxes with and without enlargement', () => {
      const src = { width: 1000, height: 500 }
      expect(fitDimensions(src, { width: 300, height: 300 }, 'inside', false)).toEqual({ width: 300, height: 150 })
      expect(fitDimensions(src, { width: 300, height: 300 }, 'outside', false)).toEqual({ width: 600, height: 300 })
      expect(fitDimensions(src, { width: 4000, height: 4000 }, 'outside', false)).toEqual({ width: 1000, height: 500 })
      expect(fitDimensions(src, { width: 4000, height: 4000 }, 'outside', true)).toEqual({ width: 8000, height: 4000 })
    })

    it('normalises formats and picks a default output format', () => {
      expect(normalizeFormat('JPG')).toEqual({ format: 'jpeg', requested: 'jpg' })
      expect(normalizeFormat('tiff')).toEqual({ requested: 'tiff' })
      expect(defaultOutputFormat('jpg')).toBe('jpeg')
      expect(defaultOutputFormat('webp')).toBe('webp')
      expect(defaultOutputFormat('gif')).toBe('png')
      expect(defaultOutputFormat('avif')).toBe('png')
      expect(defaultOutputFormat(undefined)).toBe('png')
    })

    it('detects native fits synchronously', () => {
      expect([...detectNativeFits(createFakeImage().Image)]).toEqual(['fill', 'inside'])
      expect([...detectNativeFits(createFakeImage({ nativeFits: ['fill', 'inside', 'cover', 'contain', 'outside'] }).Image)]).toEqual(['fill', 'inside', 'cover', 'contain', 'outside'])
    })
  })

  describe('processImage', () => {
    it('resizes by width only, without enlargement by default', async () => {
      const { Image, calls } = createFakeImage()
      const result = await processImage(Image, source, { w: '300', f: 'webp', q: '80' })
      expect(calls.map(c => c.method)).toEqual(['resize', 'webp', 'blob'])
      expect(calls[0]!.args).toEqual([300, undefined, { withoutEnlargement: true }])
      expect(calls[1]!.args).toEqual([{ quality: 80 }])
      expect(result).toMatchObject({ format: 'webp', mimeType: 'image/webp', fallbackFrom: undefined, notes: [] })
    })

    it('reads metadata for height-only requests and preserves aspect ratio', async () => {
      const { Image, calls } = createFakeImage({ width: 1000, height: 500 })
      await processImage(Image, source, { h: '100' })
      expect(calls.map(c => c.method)).toEqual(['metadata', 'resize', 'png', 'blob'])
      expect(calls[1]!.args).toEqual([200, 100, { fit: 'fill', withoutEnlargement: false }])
    })

    it('does not enlarge on height-only requests unless asked', async () => {
      const { Image, calls } = createFakeImage({ width: 1000, height: 500 })
      await processImage(Image, source, { h: '800' })
      expect(calls[1]!.args).toEqual([1000, 500, { fit: 'fill', withoutEnlargement: false }])
      calls.length = 0
      await processImage(Image, source, { h: '800', enlarge: '' })
      expect(calls[1]!.args).toEqual([1600, 800, { fit: 'fill', withoutEnlargement: false }])
    })

    it('emulates the default cover fit as outside when the runtime lacks it', async () => {
      const { Image, calls } = createFakeImage({ width: 1000, height: 500 })
      const result = await processImage(Image, source, { s: '300x300' })
      expect(calls.map(c => c.method)).toEqual(['metadata', 'resize', 'png', 'blob'])
      expect(calls[1]!.args).toEqual([600, 300, { fit: 'fill', withoutEnlargement: false }])
      expect(result.notes).toEqual(['fit: cover emulated as outside (no crop)'])
    })

    it('uses native cover when the runtime supports it', async () => {
      const { Image, calls } = createFakeImage({ nativeFits: ['fill', 'inside', 'cover', 'contain', 'outside'] })
      const nativeFits = detectNativeFits(Image)
      calls.length = 0
      const result = await processImage(Image, source, { s: '300x300' }, { nativeFits })
      expect(calls.map(c => c.method)).toEqual(['resize', 'png', 'blob'])
      expect(calls[0]!.args).toEqual([300, 300, { fit: 'cover', withoutEnlargement: true }])
      expect(result.notes).toEqual([])
    })

    it('passes background to native contain only', async () => {
      const { Image, calls } = createFakeImage({ nativeFits: ['fill', 'inside', 'cover', 'contain', 'outside'] })
      const nativeFits = detectNativeFits(Image)
      calls.length = 0
      await processImage(Image, source, { s: '300x300', fit: 'contain', b: 'ffffff' }, { nativeFits })
      expect(calls[0]!.args[2]).toEqual({ fit: 'contain', withoutEnlargement: true, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    })

    it('emulates contain as inside and honours defaultFit', async () => {
      const { Image, calls } = createFakeImage()
      const result = await processImage(Image, source, { s: '300x300', fit: 'contain' })
      expect(calls.map(c => c.method)).toEqual(['resize', 'png', 'blob'])
      expect(calls[0]!.args[2]).toEqual({ fit: 'inside', withoutEnlargement: true })
      expect(result.notes).toEqual(['fit: contain emulated as inside (no padding)'])

      calls.length = 0
      await processImage(Image, source, { s: '300x300' }, { defaultFit: 'inside' })
      expect(calls[0]!.args).toEqual([300, 300, { fit: 'inside', withoutEnlargement: true }])
    })

    it('clamps the emulated outside box to maxOutputDimension', async () => {
      const { Image, calls } = createFakeImage({ width: 4000, height: 1000 })
      await processImage(Image, source, { s: '3000x3000', enlarge: '' }, { maxOutputDimension: 8192 })
      // outside would be 12000x3000; the clamp keeps the aspect ratio under the cap
      expect(calls[1]!.args).toEqual([8192, 2048, { fit: 'fill', withoutEnlargement: false }])
    })

    it('clamps huge requests to maxOutputDimension', async () => {
      const { Image, calls } = createFakeImage()
      await processImage(Image, source, { s: '20000x10000', fit: 'fill', enlarge: '' }, { maxOutputDimension: 8192 })
      expect(calls[0]!.args).toEqual([8192, 4096, { fit: 'fill', withoutEnlargement: false }])
    })

    it('applies rotate, flip, flop, kernel and modulate', async () => {
      const { Image, calls } = createFakeImage()
      await processImage(Image, source, { rotate: '90', flip: '', flop: '', kernel: 'mitchell', w: '10', brightness: '1.1', grayscale: '' })
      expect(calls.map(c => c.method)).toEqual(['rotate', 'flip', 'flop', 'resize', 'modulate', 'png', 'blob'])
      expect(calls[3]!.args).toEqual([10, undefined, { filter: 'mitchell', withoutEnlargement: true }])
      expect(calls[4]!.args).toEqual([{ brightness: 1.1, saturation: 0 }])
    })

    it('keeps the source format by default and passes encoder defaults and extras', async () => {
      const { Image, calls } = createFakeImage()
      await processImage(Image, source, { q: '70', progressive: '' }, { sourceFormat: 'jpg', defaults: { jpeg: { progressive: false, quality: 90 } } })
      expect(calls[0]!.args).toEqual([{ progressive: true, quality: 70 }])

      calls.length = 0
      await processImage(Image, source, { f: 'png', q: '70', palette: '', colors: '64', dither: '', compressionLevel: '9' })
      expect(calls[0]!.args).toEqual([{ compressionLevel: 9, palette: true, colors: 64, dither: true }])

      calls.length = 0
      await processImage(Image, source, { f: 'webp', lossless: '' })
      expect(calls[0]!.args).toEqual([{ lossless: true }])
    })

    it('maps formats Bun cannot encode to fallbacks', async () => {
      const { Image } = createFakeImage()
      expect(await processImage(Image, source, { f: 'gif' })).toMatchObject({ format: 'webp', fallbackFrom: 'gif' })
      expect(await processImage(Image, source, { f: 'tiff' })).toMatchObject({ format: 'png', fallbackFrom: 'tiff' })
    })

    it('falls back when the machine lacks a codec and remembers it', async () => {
      const { Image, calls } = createFakeImage({ unsupportedFormats: ['avif'] })
      const unsupportedFormats = new Set<string>()
      const result = await processImage(Image, source, { f: 'avif', w: '10' }, { unsupportedFormats })
      expect(result).toMatchObject({ format: 'webp', fallbackFrom: 'avif' })
      expect(calls.map(c => c.method)).toEqual(['resize', 'avif', 'blob', 'resize', 'webp', 'blob'])
      expect([...unsupportedFormats]).toEqual(['avif'])

      calls.length = 0
      await processImage(Image, source, { f: 'avif' }, { unsupportedFormats })
      expect(calls.map(c => c.method)).toEqual(['webp', 'blob'])
    })

    it('rethrows other errors untouched', async () => {
      const { Image } = createFakeImage({ unsupportedFormats: ['png'] })
      await expect(processImage(Image, source, { f: 'png' })).rejects.toMatchObject({ code: 'ERR_IMAGE_FORMAT_UNSUPPORTED' })
    })

    it('passes maxPixels to the constructor', async () => {
      const { Image, constructed } = createFakeImage()
      await processImage(Image, source, { h: '10' }, { maxPixels: 1234 })
      expect(constructed.map(c => c.options)).toEqual([{ maxPixels: 1234 }, { maxPixels: 1234 }])
    })
  })
})
