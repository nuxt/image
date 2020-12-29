module.exports = {
  preset: '@nuxt/test-utils',
  moduleNameMapper: {
    '@nuxt/image/runtime': '<rootDir>/src/runtime/index.ts',
    '@nuxt/image/runtime/(.*)': '<rootDir>/src/runtime/$1',
    '~/(.*)': '<rootDir>/$1',
    '^.+\\.css$': '<rootDir>/test/fixture/utils/CSSStub.js'
  }
}
