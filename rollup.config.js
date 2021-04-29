import { terser } from 'rollup-plugin-terser'
import esbuild from 'rollup-plugin-esbuild'

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
      esbuild()
    ]
  }
}
