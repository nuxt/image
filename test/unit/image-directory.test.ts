import { copyFile, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { loadNuxt } from '@nuxt/kit'
import { createIPX, createIPXFetchHandler, ipxFSStorage } from 'ipx'
import { normalize } from 'pathe'
import { expect, it } from 'vitest'

it('resolves the root image directory from the project root', async () => {
  const root = await mkdtemp(resolve('test/fixtures/image-directory-'))
  try {
    await mkdir(join(root, 'app'))
    await mkdir(join(root, 'public'))
    await copyFile(resolve('playground/public/images/colors.jpg'), join(root, 'public/image.jpg'))
    await writeFile(join(root, 'nuxt.config.ts'), `export default defineNuxtConfig({ compatibilityDate: '2024-08-27', modules: [${JSON.stringify(resolve('src/module.ts'))}], image: { provider: 'ipx', dir: 'public' } })`)
    const nuxt = await loadNuxt({ cwd: root, dev: true, ready: true })
    try {
      const nitroConfig: { publicAssets: { dir: string }[], virtual: Record<string, unknown> } = { publicAssets: [], virtual: {} }
      await nuxt.callHook('nitro:config', nitroConfig as any)
      const dirs = nitroConfig.publicAssets.map(asset => asset.dir)
      expect(dirs).toContain(normalize(join(root, 'public')))
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
