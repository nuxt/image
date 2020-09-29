module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '~image/(.*)': '<rootDir>/src/$1',
    '^.+\\.css$': '<rootDir>/test/fixture/utils/CSSStub.js'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
      diagnostics: {
        ignoreCodes: [2345]
      }
    }
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coverageThreshold: {
    // global: {
    //   branches: 100,
    //   functions: 100,
    //   lines: 100,
    //   statements: 100
    // }
  }
}
