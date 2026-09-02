import { joinURL, encodePath } from 'ufo'
import { operationsGenerator } from './ipx'
import type { IPXModifiers } from './ipx'
import { defineProvider } from '../utils/provider'
import { warnUnsupportedBunModifiers } from '../utils/bun-modifiers'
import type { BunUnsupportedPolicy } from '../utils/bun-modifiers'
import type { BunImageRuntimeConfig } from '../server/bun/utils'

export type { BunImageRuntimeConfig }

/**
 * Modifiers understood by the `bun` provider. Names are shared with ipx so
 * presets move between the two engines; the ones Bun.Image cannot apply
 * produce a console warning (see `bun.unsupported`).
 */
export interface BunModifiers extends Omit<IPXModifiers, 'format' | 'fit' | 'kernel'> {
  format: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'heic' | 'heif' | 'auto' | (string & {})
  fit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside' | (string & {})
  kernel: 'nearest' | 'linear' | 'bilinear' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3' | 'mks2013' | 'mks2021' | 'box' | (string & {})
  /** JPEG only: emit a progressive (multi-scan) file. */
  progressive: true | 'true'
  /** WebP only: lossless encoding. */
  lossless: true | 'true'
  /** PNG only: quantise to an indexed palette. */
  palette: true | 'true'
  /** PNG only: palette size, 2-256. */
  colors: number | string
  /** PNG only: Floyd-Steinberg dithering with `palette`. */
  dither: true | 'true'
  /** PNG only: zlib level 0-9. */
  compressionLevel: number | string
}

export interface BunOptions extends Omit<BunImageRuntimeConfig, 'alias' | 'baseURL'> {
  baseURL: string
  modifiers: Partial<BunModifiers>
}

export const DEFAULT_BUN_BASE_URL = '/_bun'

export function getBunImageURL(src: string, modifiers: Record<string, unknown>, baseURL: string | undefined, nuxtBaseURL: string, policy: BunUnsupportedPolicy | undefined) {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  warnUnsupportedBunModifiers(src, modifiers, policy)

  const params = operationsGenerator(modifiers as Parameters<typeof operationsGenerator>[0]) || '_'

  return joinURL(baseURL || joinURL(nuxtBaseURL, DEFAULT_BUN_BASE_URL), params, encodePath(src))
}

export default defineProvider<Partial<BunOptions>>({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL, unsupported }, ctx) => {
    return {
      url: getBunImageURL(src, modifiers, baseURL, ctx.options.nuxt.baseURL, unsupported),
    }
  },
})
