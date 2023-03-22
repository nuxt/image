import { fileURLToPath } from 'node:url'
import { createIPX, createIPXMiddleware } from 'ipx'
import { withLeadingSlash } from 'ufo'
import { eventHandler, lazyEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default lazyEventHandler(() => {
  const ipxOptions = {
    ...(useRuntimeConfig().ipx || {}),
    // TODO: Switch to storage API when ipx supports it
    // TODO: Using relative paths for POC only
    dir: fileURLToPath(new URL(process.env.prerender ? '../../.output/public' : '../public', import.meta.url))
  }

  const ipx = createIPX(ipxOptions)
  const middleware = createIPXMiddleware(ipx)

  return eventHandler(async (event) => {
    event.node.req.url = withLeadingSlash(event.context.params._)
    await middleware(event.node.req, event.node.res)
  })
})
