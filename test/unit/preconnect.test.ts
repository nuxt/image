import { describe, expect, it, vi } from 'vitest'

const { useHead } = vi.hoisted(() => ({ useHead: vi.fn() }))

vi.mock('#imports', () => ({
  useHead,
  useRequestURL: () => new URL('https://my-site.com/page'),
}))

const { addPreconnect, resolvePreconnectOrigin } = await import('../../src/runtime/utils/preconnect')

const base = 'https://my-site.com/page'

describe('resolvePreconnectOrigin', () => {
  it('returns the origin of a cross-origin absolute https url', () => {
    expect(resolvePreconnectOrigin('https://res.cloudinary.com/nuxt/image/upload/w_100/a.jpg', base))
      .toBe('https://res.cloudinary.com')
  })

  it('returns the origin of a cross-origin absolute http url', () => {
    expect(resolvePreconnectOrigin('http://cdn.example.com/a.jpg', base))
      .toBe('http://cdn.example.com')
  })

  it('resolves a protocol-relative url against the request protocol', () => {
    expect(resolvePreconnectOrigin('//cdn.example.com/a.jpg', base))
      .toBe('https://cdn.example.com')
  })

  it('treats a different port as a different origin', () => {
    expect(resolvePreconnectOrigin('https://my-site.com:8080/a.jpg', base))
      .toBe('https://my-site.com:8080')
  })

  it('returns undefined for a same-origin absolute url', () => {
    expect(resolvePreconnectOrigin('https://my-site.com/other.jpg', base))
      .toBeUndefined()
  })

  it('returns undefined for a relative url', () => {
    expect(resolvePreconnectOrigin('/images/a.jpg', base))
      .toBeUndefined()
  })

  it('returns undefined for a data url', () => {
    expect(resolvePreconnectOrigin('data:image/png;base64,AAAA', base))
      .toBeUndefined()
  })

  it('returns undefined for a blob url', () => {
    expect(resolvePreconnectOrigin('blob:https://cdn.example.com/abc', base))
      .toBeUndefined()
  })

  it('returns undefined for non-http(s) protocols', () => {
    expect(resolvePreconnectOrigin('ftp://cdn.example.com/a.jpg', base))
      .toBeUndefined()
  })

  it('returns undefined for empty or missing urls', () => {
    expect(resolvePreconnectOrigin('', base)).toBeUndefined()
    expect(resolvePreconnectOrigin(undefined, base)).toBeUndefined()
  })
})

describe('addPreconnect', () => {
  it('registers a preconnect hint for a cross-origin url', () => {
    addPreconnect('https://cdn.example.com/a.jpg')

    expect(useHead).toHaveBeenCalledWith({
      link: [{
        rel: 'preconnect',
        href: 'https://cdn.example.com',
        key: 'preconnect:https://cdn.example.com',
      }],
    })
  })

  it('mirrors the crossorigin mode of the image', () => {
    addPreconnect('https://cdn.example.com/a.jpg', { crossorigin: 'use-credentials' })

    expect(useHead).toHaveBeenCalledWith({
      link: [{
        rel: 'preconnect',
        href: 'https://cdn.example.com',
        key: 'preconnect:https://cdn.example.com:use-credentials',
        crossorigin: 'use-credentials',
      }],
    })
  })

  it('treats an empty crossorigin as anonymous', () => {
    addPreconnect('https://cdn.example.com/a.jpg', { crossorigin: '' })

    expect(useHead).toHaveBeenCalledWith({
      link: [{
        rel: 'preconnect',
        href: 'https://cdn.example.com',
        key: 'preconnect:https://cdn.example.com:anonymous',
        crossorigin: 'anonymous',
      }],
    })
  })

  it('does not register a hint for a same-origin url', () => {
    addPreconnect('https://my-site.com/other.jpg')

    expect(useHead).not.toHaveBeenCalled()
  })

  it('does not register a hint for a relative url', () => {
    addPreconnect('/images/a.jpg')

    expect(useHead).not.toHaveBeenCalled()
  })
})
