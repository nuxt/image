import { readdir } from 'fs/promises'
import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'
import { images } from '../providers'

const missingProviderTests = [
  'strapi', // covered in a unique test
  'layer0' // backwards-compatible alias for edgio
]

describe('Provider coverage', async () => {
  const providers = await readdir(fileURLToPath(new URL('../../src/runtime/providers', import.meta.url)))
  it.each(providers)('should have tests for %s', (file) => {
    const provider = file.replace(/\.ts$/, '')
    // TODO: remove this once all providers have tests
    if (missingProviderTests.includes(provider)) {
      return
    }
    expect(provider in images[0]).toBe(true)
  })
})
