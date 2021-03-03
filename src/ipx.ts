export function createIPXMiddleware (ipxOptions) {
  const { createIPX, createIPXMiddleware } = require('ipx')
  const ipx = createIPX(ipxOptions)
  return createIPXMiddleware(ipx)
}
