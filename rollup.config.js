import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'

export default [
  getConfigFor('lazy-noscript'),
  getConfigFor('lazy-polyfill')
]

/**
 * @param {string} file
 * @returns {import('rollup').RollupOptions}
 */
function getConfigFor (file) {
  return {
    input: `./dist/runtime/scripts/${file}.js`,
    output: [
      {
        file: `./dist/runtime/scripts/${file}.min.js`,
        format: 'iife',
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'inline',
        presets: [
          [
            '@babel/preset-env', {
              targets: {
                safari: '12'
              }
            }
          ]
        ]
      })
    ]
  }
}
