import { describe, expect, it } from 'vitest'
import { netlifySetup } from '../../src/provider'
import type { ModuleOptions } from '../../src/module'

// netlifySetup writes a list of regex source strings into
// nitro.netlify.images.remote_images, one per configured domain.
function generateRemoteImages(domains: string[]): string[] {
  const nuxt = { options: { nitro: {} } }
  netlifySetup(
    {} as unknown as Parameters<typeof netlifySetup>[0],
    { domains } as unknown as ModuleOptions,
    nuxt as unknown as Parameters<typeof netlifySetup>[2],
  )
  return (nuxt.options.nitro as { netlify?: { images?: { remote_images?: string[] } } })?.netlify?.images?.remote_images ?? []
}

describe('netlify remote_images patterns', () => {
  it('generates one pattern per domain', () => {
    const patterns = generateRemoteImages(['images.example.com', 'cdn.example.org'])
    expect(patterns).toHaveLength(2)
  })

  it('anchors every generated pattern at both ends', () => {
    const patterns = generateRemoteImages(['images.example.com'])
    for (const pattern of patterns) {
      expect(pattern.startsWith('^')).toBe(true)
      expect(pattern.endsWith('$')).toBe(true)
    }
  })

  it('matches a legitimate URL on the allowlisted domain', () => {
    const [pattern] = generateRemoteImages(['images.example.com'])
    expect(new RegExp(pattern!).test('https://images.example.com/photo.jpg')).toBe(true)
  })

  it('does not match a foreign host that embeds the allowlisted domain in its path or query', () => {
    const [pattern] = generateRemoteImages(['images.example.com'])
    const re = new RegExp(pattern!)
    // A consumer that runs the pattern with a substring/`RegExp.test` match
    // against a full URL would otherwise treat these attacker-controlled
    // hosts as allowlisted, because the allowlisted domain appears somewhere
    // inside the string.
    expect(re.test('https://attacker.example/?u=https://images.example.com/x')).toBe(false)
    expect(re.test('https://images.example.com.attacker.example/x')).toBe(false)
    expect(re.test('https://attacker.example/https://images.example.com/x')).toBe(false)
  })
})
