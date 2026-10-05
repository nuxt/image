import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BUN_MODIFIERS,
  findUnsupportedBunModifiers,
  formatUnsupportedBunModifierMessage,
  resetUnsupportedBunModifierWarnings,
  warnUnsupportedBunModifiers,
} from '../../src/runtime/utils/bun-modifiers'

describe('bun provider: modifier support list', () => {
  afterEach(() => {
    resetUnsupportedBunModifierWarnings()
    vi.restoreAllMocks()
  })

  it('accepts supported, partial and Bun-only modifiers', () => {
    expect(findUnsupportedBunModifiers({ w: 10, height: 20, fit: 'inside', f: 'webp', q: 80, rotate: 90, progressive: true, animated: '' })).toEqual([])
  })

  it('reports unsupported, upstream-pending and unknown modifiers by the name used', () => {
    expect(findUnsupportedBunModifiers({ blur: 5, pos: 'top', extract: '0_0_10_10', bogus: 1, w: 10 })).toEqual(['blur', 'pos', 'extract', 'bogus'])
  })

  it('ignores undefined values', () => {
    expect(findUnsupportedBunModifiers({ blur: undefined })).toEqual([])
  })

  it('warns once per modifier name with the reason and source', () => {
    const log = vi.fn()
    expect(warnUnsupportedBunModifiers('/images/hero.jpg', { blur: 5, sharpen: 1 }, 'warn', log)).toEqual(['blur', 'sharpen'])
    warnUnsupportedBunModifiers('/images/other.jpg', { blur: 5 }, 'warn', log)
    expect(log).toHaveBeenCalledTimes(2)
    expect(log.mock.calls[0]![0]).toMatchInlineSnapshot(`"[@nuxt/image] The "blur" modifier is not supported by the bun provider (Bun.Image has no blur operation) and was ignored for "/images/hero.jpg". See https://image.nuxt.com/providers/bun#support-matrix"`)
  })

  it('stays silent with the silent policy but still reports names', () => {
    const log = vi.fn()
    expect(warnUnsupportedBunModifiers('/a.jpg', { blur: 5 }, 'silent', log)).toEqual(['blur'])
    expect(log).not.toHaveBeenCalled()
  })

  it('defaults to console.warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warnUnsupportedBunModifiers('/a.jpg', { trim: 10 })
    expect(warn).toHaveBeenCalledOnce()
  })

  it('has a generic reason for unknown modifiers', () => {
    expect(formatUnsupportedBunModifierMessage('bogus', '/a.jpg')).toContain('(Bun.Image has no such operation)')
  })

  it('documents every modifier with a status', () => {
    for (const [name, info] of Object.entries(BUN_MODIFIERS)) {
      expect(['supported', 'partial', 'upstream', 'unsupported'], name).toContain(info.status)
    }
  })
})
