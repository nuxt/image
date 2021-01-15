export function createIPXMiddleware (options) {
  const { IPX, IPXMiddleware } = require('ipx')

  const ipx = new IPX({
    inputs: [
      {
        name: 'remote',
        adapter: 'remote',
        accept: [/.*/]
      },
      {
        name: 'static',
        adapter: 'fs',
        dir: options.dir
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
