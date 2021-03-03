module.exports = {
  preset: '@nuxt/test-utils',
  moduleNameMapper: {
    '~image': '<rootDir>/src/runtime/index.ts',
    '~image/(.*)': '<rootDir>/src/runtime/$1',
    '~/(.*)': '<rootDir>/$1',
    '^.+\\.css$': '<rootDir>/test/fixture/utils/CSSStub.js'
  }
}
