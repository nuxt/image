import { describe, expect, it } from 'vitest'
import type { CreateImageOptions } from '@nuxt/image'
import { getStaticImagePrefixes, matchStaticImagePaths } from '../../src/runtime/utils/prerender'

function options(providers: Record<string, { baseURL?: string } | undefined>, baseURL = '/'): CreateImageOptions {
  return {
    nuxt: { baseURL },
    providers: Object.fromEntries(Object.entries(providers).map(([name, defaults]) => [name, { defaults, setup: () => ({}) }])),
  } as unknown as CreateImageOptions
}

describe('static image prerender prefixes', () => {
  it('uses the default route of each configured self-hosted engine', () => {
    expect(getStaticImagePrefixes(options({ ipx: {}, bunStatic: {} }))).toEqual(['/_ipx/', '/_bun/'])
    expect(getStaticImagePrefixes(options({ cloudinary: {} }))).toEqual([])
  })

  it('honours a relative custom baseURL and the app base URL', () => {
    expect(getStaticImagePrefixes(options({ bun: { baseURL: '/img' } }))).toEqual(['/img/'])
    expect(getStaticImagePrefixes(options({ ipxStatic: {}, bunStatic: {} }, '/app/'))).toEqual(['/app/_ipx/', '/app/_bun/'])
  })

  it('skips engines served from an external origin', () => {
    expect(getStaticImagePrefixes(options({ bun: { baseURL: 'https://images.example.com/_bun' }, ipx: {} }))).toEqual(['/_ipx/'])
    expect(getStaticImagePrefixes(options({ ipx: { baseURL: '//images.example.com/_ipx' } }))).toEqual([])
  })

  it('caches per options object', () => {
    const opts = options({ bun: {} })
    expect(getStaticImagePrefixes(opts)).toBe(getStaticImagePrefixes(opts))
  })
})

describe('static image path matching', () => {
  it('collects local src and srcset entries under a configured prefix', () => {
    expect(matchStaticImagePaths('/_bun/w_100/a.jpg', '/_bun/w_100/a.jpg 100w, /_bun/w_200/a.jpg 200w'))
      .toEqual(['/_bun/w_100/a.jpg', '/_bun/w_100/a.jpg', '/_bun/w_200/a.jpg'])
    expect(matchStaticImagePaths('/img/w_100/a.jpg?x=1', '', ['/img/'])).toEqual(['/img/w_100/a.jpg?x=1'])
    expect(matchStaticImagePaths('/app/_ipx/w_100/a.jpg', '', ['/app/_ipx/'])).toEqual(['/app/_ipx/w_100/a.jpg'])
  })

  it('matches at a route boundary only', () => {
    expect(matchStaticImagePaths('/imgs/w_100/a.jpg', '', ['/img/'])).toEqual([])
    expect(matchStaticImagePaths('/_bunny/w_100/a.jpg', '', ['/_bun/'])).toEqual([])
    expect(matchStaticImagePaths('/a/_bun/w_100/a.jpg', '')).toEqual([])
  })

  it('ignores external URLs and prefixes that only appear in the query or fragment', () => {
    expect(matchStaticImagePaths('https://cdn.example.com/img/a.jpg', '', ['/img/'])).toEqual([])
    expect(matchStaticImagePaths('//cdn.example.com/_bun/a.jpg', '')).toEqual([])
    expect(matchStaticImagePaths('/other.jpg?redirect=/img/a.jpg', '', ['/img/'])).toEqual([])
    expect(matchStaticImagePaths('/other.jpg#/img/a.jpg', '', ['/img/'])).toEqual([])
    expect(matchStaticImagePaths('', 'https://cdn.example.com/_ipx/a.jpg 100w')).toEqual([])
  })
})
