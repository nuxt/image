import { ServerResponse, IncomingMessage } from 'http'
import { ProviderFactory } from 'types'
import isHttps from 'is-https'
import requrl from 'requrl'

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
        name: 'remote',
        adapter: 'remote',
        accept: options.accept
      }
    ],
    cache: {
      dir: options.cacheDir,
      cleanCron: options.clearCache
    },
    sharp: options.sharp
  })
  const ipxMiddleware = IPXMiddleware(ipx)

  return (req: IncomingMessage, res: ServerResponse) => {
    const host = new URL(requrl(req)).host
    const url = req.url || '/'
    const urlArgs = url.substr(1).split('/')
    const adapter = decodeURIComponent(urlArgs.shift() || '')
    const format = decodeURIComponent(urlArgs.shift() || '')
    const operations = decodeURIComponent(urlArgs.shift() || '')
    const src = urlArgs.map(c => decodeURIComponent(c)).join('/')
    if (adapter === 'remote' && !src.startsWith('http')) {
      req.url = `/${adapter}/${format}/${operations}/http${isHttps(req) ? 's' : ''}://${host}/${src}`
    }
    return ipxMiddleware(req, res)
  }
}
