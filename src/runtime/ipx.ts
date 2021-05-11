import type { Module } from '@nuxt/types/config/module'
import { createIPX, createIPXMiddleware, IPXOptions } from 'ipx'

export default <Module<IPXOptions>> function ipxModule (options) {
  const ipx = createIPX(options)
  this.addServerMiddleware({
    path: '/_ipx',
    handle: createIPXMiddleware(ipx)
  })
}
