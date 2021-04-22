module.exports = {
  preset: '@nuxt/test-utils',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  moduleNameMapper: {
    '~image/(.*)': '<rootDir>/src/runtime/$1',
    '~image': '<rootDir>/src/runtime/index.ts',
    '~/(.*)': '<rootDir>/src/$1',
    '^.+\\.css$': '<rootDir>/test/utils/stub.js'
  },
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts'
  ],
  collectCoverageFrom: [
    'src/**',
    '!src/runtime/plugin.js'
  ]
}
