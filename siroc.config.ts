import { defineSirocConfig } from 'siroc'

import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'

export default defineSirocConfig({
  hooks: {
    'build:extendRollup' (_pkg, { rollupConfig }) {
      rollupConfig.push({
        input: './src/lazy-script.js',
        output: [
          {
            file: './dist/lazy-script.js',
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
                    ie: '9'
                  }
                }
              ]
            ]
          })
        ]
      })
    }
  }
})
