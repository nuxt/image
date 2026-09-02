/**
 * Single source of truth for which ipx-style modifiers the `bun` provider
 * (Bun.Image) can apply. Used by the client-side provider to warn at URL
 * generation time and by the server pipeline to warn or reject at request time.
 * The docs support matrix (docs/content/3.providers/bun.md) mirrors this list.
 */

type BunModifierStatus = 'supported' | 'partial' | 'upstream' | 'unsupported'

export interface BunModifierInfo {
  status: BunModifierStatus
  /** Short reason or note. Shown in warnings for non-supported modifiers. */
  note?: string
}

export const BUN_MODIFIERS: Record<string, BunModifierInfo> = {
  width: { status: 'supported' },
  height: { status: 'supported', note: 'Source size is read first.' },
  resize: { status: 'supported', note: 'Default fit differs, see fit.' },
  enlarge: { status: 'supported' },
  kernel: { status: 'supported', note: 'Same names plus mks2013, mks2021, box.' },
  format: { status: 'supported', note: 'No gif or tiff output. avif and heic need OS codecs, none on Linux. Falls back with a warning.' },
  quality: { status: 'supported', note: 'Ignored for png.' },
  flip: { status: 'supported' },
  flop: { status: 'supported' },
  grayscale: { status: 'supported' },
  brightness: { status: 'supported' },
  saturation: { status: 'supported' },
  autoorient: { status: 'supported' },
  fit: { status: 'partial', note: 'cover, contain and outside are emulated without cropping or padding unless the runtime supports them natively (Bun PR #30616).' },
  rotate: { status: 'partial', note: 'Other angles return 400.' },
  modulate: { status: 'partial', note: 'hue and lightness positions are ignored.' },
  background: { status: 'partial', note: 'Only used with native contain (Bun PR #30616).' },
  animated: { status: 'partial' },
  extract: { status: 'upstream', note: 'Bun PR #40379.' },
  crop: { status: 'upstream', note: 'Bun PR #40379.' },
  opacity: { status: 'upstream', note: 'Needs composite, Bun PR #31670.' },
  tint: { status: 'upstream', note: 'Needs raw pixel access, Bun PR #31670.' },
  position: { status: 'unsupported', note: 'Bun.Image has no crop gravity; cover is centre-crop only.' },
  trim: { status: 'unsupported', note: 'Bun.Image has no trim operation.' },
  extend: { status: 'unsupported', note: 'Bun.Image has no extend operation.' },
  sharpen: { status: 'unsupported', note: 'Bun.Image has no sharpen operation.' },
  median: { status: 'unsupported', note: 'Bun.Image has no median filter.' },
  blur: { status: 'unsupported', note: 'Bun.Image has no blur operation.' },
  dilate: { status: 'unsupported', note: 'Bun.Image has no morphology operations.' },
  erode: { status: 'unsupported', note: 'Bun.Image has no morphology operations.' },
  clahe: { status: 'unsupported', note: 'Bun.Image has no CLAHE operation.' },
  flatten: { status: 'unsupported', note: 'Bun.Image has no flatten operation.' },
  unflatten: { status: 'unsupported', note: 'Bun.Image has no unflatten operation.' },
  gamma: { status: 'unsupported', note: 'Bun.Image has no gamma operation.' },
  negate: { status: 'unsupported', note: 'Bun.Image has no negate operation.' },
  normalize: { status: 'unsupported', note: 'Bun.Image has no normalize operation.' },
  threshold: { status: 'unsupported', note: 'Bun.Image has no threshold operation.' },
  linear: { status: 'unsupported', note: 'Bun.Image has no linear operation.' },
  hue: { status: 'unsupported', note: 'Bun.Image modulate has no hue.' },
  lightness: { status: 'unsupported', note: 'Bun.Image modulate has no lightness.' },
}

/** Short ipx aliases, resolved to their canonical modifier name. */
const BUN_MODIFIER_ALIASES: Record<string, string> = {
  w: 'width',
  h: 'height',
  s: 'resize',
  f: 'format',
  q: 'quality',
  b: 'background',
  pos: 'position',
  a: 'animated',
}

/** Bun-only encoder options, accepted as modifiers. */
const BUN_EXTRA_MODIFIERS = new Set(['progressive', 'lossless', 'palette', 'colors', 'dither', 'compressionLevel'])

export type BunUnsupportedPolicy = 'warn' | 'error' | 'silent'

const BUN_SUPPORT_MATRIX_URL = 'https://image.nuxt.com/providers/bun#support-matrix'

function canonicalBunModifier(name: string): string {
  return BUN_MODIFIER_ALIASES[name] || name
}

/**
 * Names (as given, not canonicalised) of modifiers Bun.Image cannot apply.
 * Unknown modifier names are reported too, since ipx would have rejected them.
 */
export function findUnsupportedBunModifiers(modifiers: Record<string, unknown>): string[] {
  const unsupported: string[] = []
  for (const name in modifiers) {
    if (modifiers[name] === undefined) {
      continue
    }
    const canonical = canonicalBunModifier(name)
    const info = BUN_MODIFIERS[canonical]
    if (BUN_EXTRA_MODIFIERS.has(canonical)) {
      continue
    }
    if (!info || info.status === 'unsupported' || info.status === 'upstream') {
      unsupported.push(name)
    }
  }
  return unsupported
}

export function formatUnsupportedBunModifierMessage(name: string, src: string): string {
  const info = BUN_MODIFIERS[canonicalBunModifier(name)]
  const reason = (info?.note || 'Bun.Image has no such operation').replace(/\.$/, '')
  return `[@nuxt/image] The "${name}" modifier is not supported by the bun provider (${reason}) and was ignored for "${src}". See ${BUN_SUPPORT_MATRIX_URL}`
}

const warned = new Set<string>()

/**
 * Warn once per modifier name (per process, or per page in the browser) about
 * modifiers Bun.Image cannot apply. Returns the offending names so callers
 * can also reject when the policy is `error`.
 */
export function warnUnsupportedBunModifiers(src: string, modifiers: Record<string, unknown>, policy: BunUnsupportedPolicy = 'warn', log: (message: string) => void = message => console.warn(message)): string[] {
  const unsupported = findUnsupportedBunModifiers(modifiers)
  if (policy === 'silent') {
    return unsupported
  }
  for (const name of unsupported) {
    if (warned.has(name)) {
      continue
    }
    warned.add(name)
    log(formatUnsupportedBunModifierMessage(name, src))
  }
  return unsupported
}

/** Test hook: forget which modifiers have been warned about. */
export function resetUnsupportedBunModifierWarnings() {
  warned.clear()
}
