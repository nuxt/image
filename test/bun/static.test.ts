import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../../', import.meta.url))
const nuxtBin = join(root, 'node_modules/nuxt/bin/nuxt.mjs')
const outputDir = join(root, 'playground/.output/bun-static/public')

async function listFiles(dir: string, prefix = ''): Promise<string[]> {
  if (!existsSync(dir)) {
    return []
  }
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...await listFiles(join(dir, entry.name), rel))
    }
    else {
      files.push(rel)
    }
  }
  return files.sort()
}

describe('bunStatic provider: nuxt generate on Bun', () => {
  it('prerenders the bun provider page and its images', async () => {
    if (!(process.env.BUN_TEST_SKIP_BUILD && existsSync(outputDir))) {
      const generate = Bun.spawnSync({
        cmd: ['bun', '--bun', nuxtBin, 'generate', 'playground', '--envName', 'bunStatic'],
        cwd: root,
        env: { ...process.env, NUXT_IMAGE_PROVIDER: 'bunStatic' },
        stdout: 'pipe',
        stderr: 'pipe',
      })
      if (generate.exitCode !== 0) {
        console.error(generate.stdout.toString(), generate.stderr.toString())
      }
      expect(generate.exitCode).toBe(0)
    }

    const files = await listFiles(join(outputDir, '_bun'))
    expect(files).toContain('s_300x300/images/colors.jpg')
    expect(files).toContain('s_300x300/images/everest.jpg')
    expect(files).toContain('s_300x300/images/tacos.svg')

    const colors = await Bun.file(join(outputDir, '_bun/s_300x300/images/colors.jpg')).bytes()
    expect(await new Bun.Image(colors).metadata()).toMatchObject({ width: 450, height: 300, format: 'jpeg' })
    expect((await Bun.file(join(outputDir, '_bun/s_300x300/images/tacos.svg')).text())).toContain('<svg')
  }, 600_000)
})
