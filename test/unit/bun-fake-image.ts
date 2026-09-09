import type { BunImageConstructor, BunImage, BunResizeOptions } from '../../src/runtime/server/bun/pipeline'

interface FakeCall {
  method: string
  args: unknown[]
}

export interface FakeImageOptions {
  /** Source dimensions reported by `metadata()`. */
  width?: number
  height?: number
  format?: string
  /** Fit modes accepted by `resize()`. Default: fill and inside, like Bun 1.4.0. */
  nativeFits?: string[]
  /** Output formats whose terminal rejects with ERR_IMAGE_FORMAT_UNSUPPORTED. */
  unsupportedFormats?: string[]
}

/**
 * A recording stand-in for `Bun.Image` with the validation behaviour observed
 * in Bun 1.4.0: unsupported `fit` throws synchronously at `resize()`, and
 * unsupported output formats reject at the terminal.
 */
export function createFakeImage(options: FakeImageOptions = {}) {
  const calls: FakeCall[] = []
  const constructed: { input: Uint8Array, options?: unknown }[] = []
  const nativeFits = new Set(options.nativeFits || ['fill', 'inside'])
  const unsupportedFormats = new Set(options.unsupportedFormats || [])

  class FakeImage implements BunImage {
    private format = 'png'
    private encoder: Record<string, unknown> | undefined

    constructor(input: Uint8Array, ctorOptions?: { maxPixels?: number, autoOrient?: boolean }) {
      constructed.push({ input, options: ctorOptions })
    }

    private record(method: string, ...args: unknown[]) {
      calls.push({ method, args })
      return this
    }

    resize(width: number, height?: number, resizeOptions?: BunResizeOptions) {
      if (typeof width !== 'number') {
        throw Object.assign(new Error('resize(width, height?, options?)'), { code: 'ERR_INVALID_ARG_TYPE' })
      }
      if (resizeOptions?.fit && !nativeFits.has(resizeOptions.fit)) {
        throw Object.assign(new Error(`fit must be one of ${[...nativeFits].map(f => `'${f}'`).join(' or ')}`), { code: 'ERR_INVALID_ARG_TYPE' })
      }
      return this.record('resize', width, height, resizeOptions)
    }

    rotate(degrees: number) {
      if (degrees % 90 !== 0) {
        throw Object.assign(new Error('rotate: only multiples of 90 are supported'), { code: 'ERR_INVALID_ARG_TYPE' })
      }
      return this.record('rotate', degrees)
    }

    flip() {
      return this.record('flip')
    }

    flop() {
      return this.record('flop')
    }

    modulate(modulateOptions: { brightness?: number, saturation?: number }) {
      return this.record('modulate', modulateOptions)
    }

    private setFormat(format: string, encoder?: Record<string, unknown>) {
      this.format = format
      this.encoder = encoder
      return this.record(format, encoder)
    }

    jpeg(encoder?: Record<string, unknown>) {
      return this.setFormat('jpeg', encoder)
    }

    png(encoder?: Record<string, unknown>) {
      return this.setFormat('png', encoder)
    }

    webp(encoder?: Record<string, unknown>) {
      return this.setFormat('webp', encoder)
    }

    avif(encoder?: Record<string, unknown>) {
      return this.setFormat('avif', encoder)
    }

    heic(encoder?: Record<string, unknown>) {
      return this.setFormat('heic', encoder)
    }

    async blob() {
      calls.push({ method: 'blob', args: [] })
      if (unsupportedFormats.has(this.format)) {
        throw Object.assign(new Error('Image: format not supported on this machine'), { code: 'ERR_IMAGE_FORMAT_UNSUPPORTED' })
      }
      const mime = this.format === 'jpeg' ? 'image/jpeg' : `image/${this.format}`
      return new Blob([new TextEncoder().encode(`fake-${this.format}-${JSON.stringify(this.encoder || {})}`)], { type: mime })
    }

    async metadata() {
      calls.push({ method: 'metadata', args: [] })
      return { width: options.width ?? 1000, height: options.height ?? 500, format: options.format ?? 'jpeg' }
    }
  }

  return { Image: FakeImage as unknown as BunImageConstructor, calls, constructed }
}
