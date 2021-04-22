import type { IPXOptions } from 'ipx'

export function createIPXMiddleware (ipxOptions: IPXOptions) {
  const { createIPX, createIPXMiddleware } = require('ipx') as typeof import('ipx')
  const ipx = createIPX(ipxOptions)
  return createIPXMiddleware(ipx)
}
