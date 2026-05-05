import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { images } from '../providers'
import { providers as playgroundProviders } from '../../playground/app/providers'

const missingProviderTests = [
  'ipxStatic', // build-time-only alias for ipx
  'strapi', // covered in a unique test
  'strapi5', // covered in a unique test
]

const files = await readdir(
  fileURLToPath(new URL('../../src/runtime/providers', import.meta.url)),
)
const providers = files.map(f => f.replace(/\.ts$/, ''))
const withProviderTests = providers.filter(p => !missingProviderTests.includes(p))

const matrixCases = withProviderTests.flatMap(provider =>
  images.map((image, index) => ({
    provider,
    image,
    index,
  })),
)

describe('Provider coverage', () => {
  it('providers should not be empty', () => {
    expect(providers.length).toBeGreaterThan(0)
  })
  it('images should not be empty', () => {
    expect(images.length).toBeGreaterThan(0)
  })

  it('each provider should exist exactly once in playground', () => {
    for (const provider of withProviderTests) {
      const matches = playgroundProviders.filter(p => p.name === provider)
      expect(
        matches.length,
        `expect exactly 1 match for "${provider}", got ${matches.length}`,
      ).toBe(1)
    }
  })

  it('each image should have a key and defined value for its provider', () => {
    for (const { provider, image, index } of matrixCases) {
      // check key exists
      expect(
        Object.prototype.hasOwnProperty.call(image, provider),
      ).toBe(true)
      // check value is defined
      expect(
        image[provider as keyof typeof image],
        `expect value for ${provider} in images[${index}]`,
      ).toBeDefined()
    }
  })

  it('all playground providers should exist in runtime', () => {
    for (const p of playgroundProviders) {
      expect(
        providers.includes(p.name),
        `Playground provider not found in runtime: ${p.name}`,
      ).toBe(true)
    }
  })

  it('images should not contain unknown providers', () => {
    const allowedKeys = new Set(['args', ...withProviderTests])
    for (const [index, image] of images.entries()) {
      for (const key of Object.keys(image)) {
        expect(
          allowedKeys.has(key),
          `Unknown provider "${key}" in images[${index}]`,
        ).toBe(true)
      }
    }
  })

  it('each provider should appear in at least one image', () => {
    for (const provider of withProviderTests) {
      const count = images.filter(img =>
        Object.prototype.hasOwnProperty.call(img, provider),
      ).length

      expect(
        count,
        `Provider "${provider}" does not appear in any image`,
      ).toBeGreaterThan(0)
    }
  })

  it('expect missingProviderTests to shrink over time', () =>
    // TODO: remove this once all providers have tests
    expect(missingProviderTests.length).toMatchInlineSnapshot(`3`))
})
