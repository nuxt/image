import { cp, readdir, rm } from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'ipx',
  ],
  hooks: {
    'rollup:done': async function () {
      // temporary solution for this PR while I create fix in `mkdist` (relative module extensions not correct when referring outside)
      for (const file of await readdir('dist')) {
        if (file.endsWith('.mjs') || file.endsWith('.d.mts')) {
          await cp(`dist/${file}`, `dist/${file.replace('.mjs', '.js').replace('.d.mts', '.d.ts')}`)
          await rm(`dist/${file}`)
        }
      }
    },
  },
})
