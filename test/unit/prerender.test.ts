import { describe, expect, it } from 'vitest'
import type { CreateImageOptions } from '@nuxt/image'
import { getStaticImagePrefixes } from '../../src/runtime/utils/prerender'

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
