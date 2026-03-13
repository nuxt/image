// https://docs.flyimg.io/url-options/

import { joinURL, hasProtocol } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

/**
 * Flyimg URL format:
 * https://flyimg.example.com/{processType}/{image_options}/{path_to_image}
 *
 * Example:
 * https://demo.flyimg.io/upload/w_300,h_200,q_85/https://example.com/image.jpg
 */
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    // Core dimensions
    width: 'w',
    height: 'h',
    quality: 'q',
    format: 'o',
    rotate: 'r',

    // Cropping
    crop: 'c',
    gravity: 'g',

    // WebP
    webpLossless: 'webpl',
    webpMethod: 'webpm',

    // JPEG XL
    jxlEffort: 'jxlef',
    jxlDecodingSpeed: 'jxlds',

    // Cache
    refresh: 'rf',
    version: 'v',

    // Text / Watermark
    text: 't',
    textColor: 'tc',
    textSize: 'ts',
    textBackground: 'tbg',

    // Image Processing
    background: 'bg',
    strip: 'st',
    autoOrient: 'ao',
    resize: 'rz',
    mozjpeg: 'moz',
    unsharp: 'unsh',
    sharpen: 'sh',
    blur: 'blr',
    filter: 'f',
    scale: 'sc',
    samplingFactor: 'sf',
    preserveAspectRatio: 'par',
    preserveNaturalSize: 'pns',

    // Advanced
    faceCrop: 'fc',
    faceCropPosition: 'fcp',
    faceBlur: 'fb',
    smartCrop: 'smc',
    colorspace: 'clsp',
    monochrome: 'mnchr',

    // PDF
    pdfPage: 'pdfp',
    density: 'dnst',

    // Video
    videoTime: 'tm',

    // Extract
    extract: 'e',
    extractTopX: 'p1x',
    extractTopY: 'p1y',
    extractBottomX: 'p2x',
    extractBottomY: 'p2y',

    // Other
    extent: 'ett',
    gifFrame: 'gf',
  },
  valueMap: {
    // Booleans become 0 / 1
    crop: Number,
    webpLossless: Number,
    refresh: Number,
    autoOrient: Number,
    resize: Number,
    scale: Number,
    faceCrop: Number,
    faceBlur: Number,
    smartCrop: Number,
    monochrome: Number,
    extract: Number,
    // Inverted-defaults (strip/mozjpeg/par/pns default ON on the server;
    // we only emit them when explicitly set to false — see getImage pre-processing)
    strip: Number,
    mozjpeg: Number,
    preserveAspectRatio: Number,
    preserveNaturalSize: Number,
    // Encode colours so # does not break the URL path segment
    background: (value: string) => value.startsWith('#') ? value.replace('#', '%23') : value,
    textColor: (value: string) => value.startsWith('#') ? value.replace('#', '%23') : value,
    textBackground: (value: string) => value.startsWith('#') ? value.replace('#', '%23') : value,
    // Encode text watermarks
    text: (value: string) => encodeURIComponent(value),
  },
  joinWith: ',',
  formatter: (key, value) => `${key}_${value}`,
})

interface FlyimgOptions {
  /**
   * Base URL of the Flyimg server.
   *
   * For the official Flyimg SaaS each instance gets a unique subdomain:
   * `https://img-abc123.flyimg.io`
   *
   * For self-hosted instances use the URL of your deployment,
   * e.g. `https://images.example.com`.
   */
  baseURL: string

  /**
   * Public base URL of your website.
   *
   * Only applied to **relative** image paths (e.g. `/images/photo.jpg`) —
   * the value is prepended to produce an absolute URL that Flyimg can fetch.
   * Absolute `src` values (e.g. from a CDN) are passed through unchanged and
   * this option has no effect for those.
   *
   * Example: `https://www.example.com`
   */
  sourceURL?: string

  /**
   * Flyimg process type.
   *
   * - `upload` (default): fetch, transform, cache and serve the image.
   * - `path`: same as upload but returns the path to the cached image as a
   *   plain-text response body instead of serving the image directly.
   *
   * @default 'upload'
   */
  processType?: 'upload' | 'path'
}

export default defineProvider<FlyimgOptions>({
  getImage: (src, options) => {
    const {
      modifiers: rawModifiers = {},
      baseURL,
      sourceURL,
      processType = 'upload',
    } = options

    if (import.meta.dev && !baseURL) {
      console.warn('[nuxt] [image] [flyimg] `baseURL` is required. Set it in your nuxt.config under `image.flyimg.baseURL`.')
    }

    // --- fit → Flyimg flags ------------------------------------------------
    const {
      fit,
      strip,
      mozjpeg,
      preserveAspectRatio,
      preserveNaturalSize,
      ...rest
    } = rawModifiers as Record<string, unknown>

    const modifiers: Partial<Record<string, string | number | boolean>> = { ...rest } as Partial<Record<string, string | number | boolean>>

    switch (fit) {
      case 'cover':
        // Crop to fill the target rectangle (Flyimg: c_1)
        if (!modifiers.crop) modifiers.crop = true
        break
      case 'fill':
        // Stretch to fill — disable aspect-ratio preservation (Flyimg: par_0)
        if (preserveAspectRatio !== false) modifiers.preserveAspectRatio = false
        break
      case 'contain':
      case 'inside':
        // Flyimg default behaviour when width + height are given — no extra flags needed
        break
      case 'outside':
        if (import.meta.dev) {
          console.warn('[nuxt] [image] [flyimg] fit="outside" is not supported by Flyimg and will be ignored.')
        }
        break
    }

    // --- Inverted-defaults --------------------------------------------------
    // strip / mozjpeg / preserveAspectRatio / preserveNaturalSize default to
    // 1 (enabled) in Flyimg, so we only need to emit them when explicitly
    // disabled. Treat boolean false, numeric 0, and string '0' as opt-out.
    const isDisabled = (v: unknown) => v === false || v === 0 || v === '0'
    if (strip != null && isDisabled(strip)) modifiers.strip = false
    if (mozjpeg != null && isDisabled(mozjpeg)) modifiers.mozjpeg = false
    if (preserveAspectRatio != null && isDisabled(preserveAspectRatio)) modifiers.preserveAspectRatio = false
    if (preserveNaturalSize != null && isDisabled(preserveNaturalSize)) modifiers.preserveNaturalSize = false

    // --- Resolve image URL -------------------------------------------------
    // Flyimg needs an absolute source URL. If src is relative and sourceURL is
    // configured, make it absolute.
    if (import.meta.dev && !hasProtocol(src) && !sourceURL) {
      console.warn('[nuxt] [image] [flyimg] `src` is a relative path but `sourceURL` is not configured. Flyimg requires an absolute source URL. Set `image.flyimg.sourceURL` in your nuxt.config.')
    }
    const imageUrl = !hasProtocol(src) && sourceURL
      ? joinURL(sourceURL, src)
      : src

    // --- Build Flyimg URL --------------------------------------------------
    const operations = operationsGenerator(modifiers as Partial<Record<string, string | number>>)
    const imageOptions = operations || '-'

    // Construct the path manually so that an absolute imageUrl is treated as a
    // literal path segment rather than a new base by ufo's joinURL.
    // Note: if reverse-proxied via nginx, set `merge_slashes off` to prevent
    // nginx from collapsing the `https://` embedded in this path. See docs.
    return {
      url: joinURL(baseURL || '/', `${processType}/${imageOptions}/${imageUrl}`),
    }
  },
})
