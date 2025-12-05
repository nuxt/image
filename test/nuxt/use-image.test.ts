import { describe, it, expect } from 'vitest'
import { useImage } from '#imports'

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
    expect(() => useImage().getImage('/test.png', {
      // @ts-expect-error invalid provider
      provider: 'invalid',
    })).toThrow(Error)
  })

  it('Deny undefined preset', () => {
    expect(() => useImage().getImage('/test.png', { preset: 'invalid' })).toThrow(Error)
  })

  it('is correctly typed for provider options', () => {
    useImage().getImage('/test.png', {
      provider: 'ipx',
      modifiers: {
        sharpen: 0.75,
      },
    })

    // defaults to ipx as default provider
    useImage().getImage('/test.png', {
      modifiers: {
        sharpen: 0.75,
      },
    })
  })
})
