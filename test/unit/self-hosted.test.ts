import { describe, expect, it } from 'vitest'
import type { Nuxt } from '@nuxt/schema'
import { hasUserProvidedHandler } from '../../src/self-hosted'

function nuxtWith(routes: string[], devRoutes: string[] = []) {
  return {
    options: {
      serverHandlers: routes.map(route => ({ route, handler: 'x' })),
      devServerHandlers: devRoutes.map(route => ({ route, handler: 'x' })),
    },
  } as unknown as Nuxt
}

describe('self-hosted engines: user-provided handler detection', () => {
  it('matches the base itself and routes below it', () => {
    expect(hasUserProvidedHandler(nuxtWith(['/_ipx/**']), '/_ipx')).toBe(true)
    expect(hasUserProvidedHandler(nuxtWith(['/_ipx']), '/_ipx')).toBe(true)
    expect(hasUserProvidedHandler(nuxtWith([], ['/_bun/**']), '/_bun/')).toBe(true)
  })

  it('does not match routes that merely share a prefix', () => {
    expect(hasUserProvidedHandler(nuxtWith(['/_ipx-assets/**']), '/_ipx')).toBe(false)
    expect(hasUserProvidedHandler(nuxtWith(['/_bunny/**']), '/_bun')).toBe(false)
  })

  it('treats an external base URL as user provided', () => {
    expect(hasUserProvidedHandler(nuxtWith([]), 'https://images.example.com/_ipx')).toBe(true)
    expect(hasUserProvidedHandler(nuxtWith([]), '//images.example.com/_ipx')).toBe(true)
    expect(hasUserProvidedHandler(nuxtWith([]), '/_ipx')).toBe(false)
  })
})
