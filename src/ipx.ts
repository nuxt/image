export function createIPXMiddleware (options) {
  const { IPX, IPXMiddleware } = require('ipx')

  const ipx = new IPX({
    inputs: [
      {
        name: 'default',
        adapter: 'remote',
        accept: [/.*/]
      }
    ],
    cache: {
      dir: options.cacheDir,
      cleanCron: options.clearCache
    },
    sharp: options.sharp
  })

  return IPXMiddleware(ipx)
}
