import { ProviderFactory } from '../../types'
const { IPX, IPXMiddleware } = require('ipx')

export default <ProviderFactory>function(providerOptions) {

  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: providerOptions,
    middleware: createMiddleware(providerOptions)
  }
}

function createMiddleware(options) {
  const ipx = new IPX({
    input: {
      adapter: 'fs',
      dir: options.dir
    },
    cache: {
      cleanCron: options.clearCache || false,
    }
  });
  return IPXMiddleware(ipx)
}
