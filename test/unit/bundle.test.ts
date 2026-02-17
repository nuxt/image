import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promises as fsp } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { buildNuxt, loadNuxt } from '@nuxt/kit'
import type { NuxtConfig } from '@nuxt/schema'
import { describe, it, expect } from 'vitest'
import { glob } from 'tinyglobby'
import { isWindows } from 'std-env'

describe.skipIf(process.env.ECOSYSTEM_CI || isWindows)('nuxt image bundle size', () => {
  it('should match snapshot', { timeout: 120_000 }, async () => {
    const rootDir = fileURLToPath(new URL('../.tmp', import.meta.url))
    await fsp.rm(rootDir, { recursive: true, force: true })

    const [withoutImage, withImage] = await Promise.all([
      build(join(rootDir, 'without')),
      build(join(rootDir, 'with'), {
        modules: ['@nuxt/image'],
        image: { provider: 'ipx' },
      }),
    ])

    expect(roundToKilobytes(withImage.totalBytes - withoutImage.totalBytes)).toMatchInlineSnapshot(`"12.4k"`)
  })
})

async function build(rootDir: string, config: NuxtConfig = {}) {
  await mkdir(rootDir, { recursive: true })
  await writeFile(join(rootDir, 'app.vue'), `<template><NuxtImg src="/test.jpg" /><NuxtPicture src="/test.jpg" /></template>`)
  const nuxt = await loadNuxt({
    cwd: rootDir,
    ready: true,
    overrides: {
      ssr: false,
      ...config,
    },
  })
  await buildNuxt(nuxt)
  await nuxt.close()
  return await analyzeSizes(['**/*.js'], join(rootDir, '.output/public'))
}
async function analyzeSizes(pattern: string[], rootDir: string) {
  const files: string[] = await glob(pattern, { cwd: rootDir })
  let totalBytes = 0
  for (const file of files) {
    const path = join(rootDir, file)
    const isSymlink = (await fsp.lstat(path).catch(() => null))?.isSymbolicLink()

    if (!isSymlink) {
      const bytes = Buffer.byteLength(await fsp.readFile(path))
      totalBytes += bytes
    }
  }
  return { files, totalBytes }
}

function roundToKilobytes(bytes: number) {
  return (bytes / 1024).toFixed(bytes > (100 * 1024) ? 0 : 1) + 'k'
}
