import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    emitCJS: false,
    cjsBridge: false,
  },
  externals: [
    'ipx',
  ],
})
