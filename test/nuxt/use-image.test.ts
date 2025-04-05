import { describe, it, expect } from 'vitest'

describe('image helper', () => {
  it.skip('Generate placeholder', async () => {
    // TODO: see https://github.com/nuxt/image/issues/189)
    // const placeholder = nuxtContext.$img?.getPlaceholder('/test.png')
    // expect(placeholder).toMatchInlineSnapshot('/_image/local/_/w_30/test.png')
  })

  it('Generate image with IPX', () => {
    const { url } = useImage().getImage('/test.png', { provider: 'ipx' })!
    expect(url).toMatchInlineSnapshot('"/_ipx/_/test.png"')
  })

  it('Deny undefined provider', () => {
    expect(() => useImage().getImage('/test.png', { provider: 'invalid' })).toThrow(Error)
  })

  it('Deny undefined preset', () => {
    expect(() => useImage().getImage('/test.png', { preset: 'invalid' })).toThrow(Error)
  })
})
