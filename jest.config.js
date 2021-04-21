module.exports = {
  preset: '@nuxt/test-utils',
  transform: {
    '\\.(js|ts)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript'
        ],
        plugins: ['@babel/plugin-transform-runtime']
      }
    ],
    '^.+\\.vue$': 'vue-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'json'],
  moduleNameMapper: {
    '~image/(.*)': '<rootDir>/src/runtime/$1',
    '~image': '<rootDir>/src/runtime/index.ts',
    '~/(.*)': '<rootDir>/$1',
    '^.+\\.css$': '<rootDir>/test/fixture/utils/CSSStub.js'
  }
}
