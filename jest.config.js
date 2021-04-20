module.exports = {
  preset: '@nuxt/test-utils',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'vue'],
  moduleNameMapper: {
    '~image': '<rootDir>/src/runtime/index.ts',
    '~image/(.*)': '<rootDir>/src/runtime/$1',
    '~/(.*)': '<rootDir>/$1',
    '^.+\\.css$': '<rootDir>/test/fixture/utils/CSSStub.js'
  }
}
