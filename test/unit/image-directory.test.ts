import { copyFile, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { loadNuxt } from '@nuxt/kit'
import { createIPX, createIPXFetchHandler, ipxFSStorage } from 'ipx'
import { normalize } from 'pathe'
import { expect, it } from 'vitest'

it.each([
  { name: 'Nuxt 4 layout', compatibilityVersion: 4, srcDir: 'app', configuredDir: 'public', imageDir: 'public', unexpectedDir: 'app/public' },
  { name: 'Nuxt 4 relative public path', compatibilityVersion: 4, srcDir: 'app', configuredDir: './public', imageDir: 'public', unexpectedDir: 'app/public' },
  { name: 'Nuxt 4 public path with trailing slash', compatibilityVersion: 4, srcDir: 'app', configuredDir: 'public/', imageDir: 'public', unexpectedDir: 'app/public' },
  { name: 'Nuxt 3 layout with custom srcDir', compatibilityVersion: 3, srcDir: 'src', configuredDir: 'public', imageDir: 'src/public', unexpectedDir: 'public' },
  { name: 'Nuxt 4 custom image directory', compatibilityVersion: 4, srcDir: 'app', configuredDir: 'assets/images', imageDir: 'app/assets/images', unexpectedDir: 'assets/images' },
])('resolves the image directory for $name', async ({ compatibilityVersion, srcDir, configuredDir, imageDir, unexpectedDir }) => {
  const root = await mkdtemp(resolve('test/fixtures/image-directory-'))
  try {
    await mkdir(join(root, srcDir), { recursive: true })
    await mkdir(join(root, imageDir), { recursive: true })
    await mkdir(join(root, unexpectedDir), { recursive: true })
    await copyFile(resolve('playground/public/images/colors.jpg'), join(root, imageDir, 'image.jpg'))
    await writeFile(join(root, 'nuxt.config.ts'), `export default defineNuxtConfig({ compatibilityDate: '2024-08-27', future: { compatibilityVersion: ${compatibilityVersion} }, srcDir: ${JSON.stringify(srcDir)}, modules: [${JSON.stringify(resolve('src/module.ts'))}], image: { provider: 'ipx', dir: ${JSON.stringify(configuredDir)} } })`)
    const nuxt = await loadNuxt({ cwd: root, dev: true, ready: true })
    try {
      const nitroConfig: { publicAssets: { dir: string }[], virtual: Record<string, unknown> } = { publicAssets: [], virtual: {} }
      await nuxt.callHook('nitro:config', nitroConfig as any)
      const dirs = nitroConfig.publicAssets.map(asset => asset.dir)
      expect(dirs).toContain(normalize(join(root, imageDir)))
      expect(dirs).not.toContain(normalize(join(root, unexpectedDir)))
      const handler = createIPXFetchHandler(createIPX({ storage: ipxFSStorage({ dir: dirs }) }))
      const response = await handler(new Request('http://localhost/_/image.jpg'))
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('image/jpeg')
    }
    finally {
      await nuxt.close()
    }
  }
  finally {
    await rm(root, { recursive: true, force: true })
  }
})
