import { ProviderFactory } from 'types'

export default <ProviderFactory> function (providerOptions) {
  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: {
      baseURL: providerOptions.baseURL
    },
    middleware: createMiddleware(providerOptions)
  }
}

function createMiddleware (options) {
  const { IPX, IPXMiddleware } = require('ipx')

  const ipx = new IPX({
    inputs: [
      {
        name: 'local',
        adapter: 'fs',
        dir: options.dir
      },
      {
        name: 'remote',
        adapter: 'remote',
        accept: options.accept
      }
    ],
    cache: {
      dir: options.cacheDir,
      cleanCron: options.clearCache
    }
  })
  return IPXMiddleware(ipx)
}
