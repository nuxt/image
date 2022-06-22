import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true
  },
  entries: [
    { input: './src/runtime/', outDir: 'dist/runtime', ext: 'js' },
    './src/module'
  ],
  externals: [
    'ipx',
    '@nuxt/types'
  ]
})
