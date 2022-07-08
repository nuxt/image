import { fileURLToPath } from 'node:url'
import { createIPX, createIPXMiddleware } from 'ipx'
import { withLeadingSlash } from 'ufo'
import { eventHandler, lazyEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default lazyEventHandler(() => {
  const ipxOptions = {
    ...(useRuntimeConfig().ipx || {}),
    // TODO: Switch to storage API when ipx supports it
    dir: fileURLToPath(new URL('../public', import.meta.url))
  }

  const ipx = createIPX(ipxOptions)
  const middleware = createIPXMiddleware(ipx)

  return eventHandler(async (event) => {
    event.req.url = withLeadingSlash(event.context.params._)
    await middleware(event.req, event.res)
  })
})
