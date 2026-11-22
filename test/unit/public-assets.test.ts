import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { loadNuxt } from '@nuxt/kit'
import type { Nitro } from 'nitropack'
import { describe, it, expect } from 'vitest'

describe('image directories', () => {
  it('copies a custom directory to the output for the ipx provider', { timeout: 60_000 }, async () => {
    const { publicAssetDirs, imageDir } = await setupNuxt('ipx', 'ipx')
    expect(publicAssetDirs).toContain(imageDir)
  })

  it('does not copy a custom directory to the output for the ipxStatic provider', { timeout: 60_000 }, async () => {
    const { publicAssetDirs, imageDir, publicDir } = await setupNuxt('ipx-static', 'ipxStatic')
    expect(publicAssetDirs).not.toContain(imageDir)
    expect(publicAssetDirs).toContain(publicDir)
  })
})

async function setupNuxt(name: string, provider: string) {
  const rootDir = fileURLToPath(new URL(`.tmp/public-assets/${name}`, import.meta.url))
  await rm(rootDir, { recursive: true, force: true })
  const imageDir = join(rootDir, 'app/assets/images')
  const publicDir = join(rootDir, 'public')
  await mkdir(imageDir, { recursive: true })
  await mkdir(publicDir, { recursive: true })
  await writeFile(join(rootDir, 'app/app.vue'), `<template><NuxtImg src="/test.jpg" /></template>`)
  await writeFile(join(rootDir, 'nuxt.config.ts'), `export default defineNuxtConfig({ image: { provider: '${provider}', dir: 'assets/images' } })`)

  let nitro: Nitro | undefined
  const nuxt = await loadNuxt({
    cwd: rootDir,
    ready: true,
    overrides: {
      modules: ['@nuxt/image'],
      hooks: {
        'nitro:init': (_nitro) => {
          nitro = _nitro
        },
      },
    },
  })
  const publicAssetDirs = nitro!.options.publicAssets.map(asset => asset.dir)
  await nuxt.close()
  return { publicAssetDirs, imageDir, publicDir }
}
