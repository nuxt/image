import { fileURLToPath } from 'node:url'
import { createIPX, createIPXMiddleware } from 'ipx'
import { withLeadingSlash } from 'ufo'
import { eventHandler, lazyEventHandler } from 'h3'
import type { NitroRuntimeConfig } from 'nitropack'
import { useRuntimeConfig } from '#imports'

export default lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx as NitroRuntimeConfig['ipx'] || {} as Record<string, never>
  const ipxOptions = {
    ...opts,
    // TODO: Switch to storage API when ipx supports it
    dir: opts.dir ? fileURLToPath(new URL(opts.dir, import.meta.url)) : undefined
  }

  const ipx = createIPX(ipxOptions)
  const middleware = createIPXMiddleware(ipx)

  return eventHandler(async (event) => {
    event.node.req.url = withLeadingSlash(event.context.params!._)
    await middleware(event.node.req, event.node.res)
  })
})
