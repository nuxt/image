import { describe, expect, it } from 'vitest'
import { BunImageError, parseImageURL, safeString } from '../../src/runtime/server/bun/utils'

describe('bun provider: URL parser', () => {
  it('parses modifiers and id with the ipx grammar', () => {
    expect(parseImageURL('/_bun/w_200&f_webp,q_80/images/colors.jpg', '/_bun')).toEqual({
      id: 'images/colors.jpg',
      modifiers: { w: '200', f: 'webp', q: '80' },
    })
  })

  it('treats `_` as no modifiers', () => {
    expect(parseImageURL('/_bun/_/images/colors.jpg', '/_bun')).toEqual({ id: 'images/colors.jpg', modifiers: {} })
  })

  it('accepts `:` and `=` separators and flag modifiers', () => {
    expect(parseImageURL('/_bun/s:300x300&flip&fit=inside/a.png', '/_bun').modifiers).toEqual({ s: '300x300', flip: '', fit: 'inside' })
  })

  it('keeps extra `_` inside values', () => {
    expect(parseImageURL('/_bun/modulate_1.2_0_90/a.png', '/_bun').modifiers).toEqual({ modulate: '1.2_0_90' })
  })

  it('decodes percent-encoded ids and keeps malformed encoding', () => {
    expect(parseImageURL('/_bun/_/%E6%B1%89%E5%AD%97.png', '/_bun').id).toBe('汉字.png')
    expect(parseImageURL('/_bun/_/100%.jpg', '/_bun').id).toBe('100%.jpg')
  })

  it('accepts absolute URLs and ignores the query string', () => {
    expect(parseImageURL('http://localhost:3000/_bun/w_10/https://images.unsplash.com/photo?x=1', '/_bun').id).toBe('https://images.unsplash.com/photo')
  })

  it('works without a base URL and with a trailing slash on it', () => {
    expect(parseImageURL('/w_10/a.png').id).toBe('a.png')
    expect(parseImageURL('/_bun/w_10/a.png', '/_bun/').id).toBe('a.png')
  })

  it('rejects missing modifiers or id', () => {
    expect(() => parseImageURL('/_bun/', '/_bun')).toThrowError(BunImageError)
    expect(() => parseImageURL('/_bun/w_10', '/_bun')).toThrowError(/Resource id is missing/)
    expect(() => parseImageURL('/_bun/w_10/', '/_bun')).toThrowError(/Resource id is missing/)
  })

  it('escapes control characters', () => {
    expect(safeString('a\nb')).toBe('a\\nb')
    expect(parseImageURL('/_bun/w%0A_10/a%0D.png', '/_bun')).toEqual({ id: 'a\\r.png', modifiers: { 'w%0A': '10' } })
  })
})
