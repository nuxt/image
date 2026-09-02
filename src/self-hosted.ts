import type { Nitro, NitroEventHandler } from 'nitropack'
import type { Nuxt } from '@nuxt/schema'
import { defu } from 'defu'
import { hasProtocol } from 'ufo'

/**
 * Shared wiring for self-hosted image engines (ipx, bun): registering the
 * Nitro route handler, exposing engine options through runtime config, and
 * making the same handler available to the prerenderer.
 */
export interface SelfHostedHandlerOptions<T extends object> {
  /** Route prefix the handler is mounted on, e.g. `/_ipx`. */
  baseURL: string
  /** Key under `runtimeConfig` where the engine reads its options. */
  runtimeConfigKey: string
  /** Absolute path of the Nitro event handler module. */
  handler: string
  /** Options exposed to the runtime handler. */
  runtimeOptions: T
  /** Options merged on top of `runtimeOptions` for the prerenderer only. */
  prerenderOptions?: Partial<T>
  /** Static providers only prerender, they register no runtime route. */
  isStatic?: boolean
}

/**
 * Whether the user already registered a handler on `baseURL`, or pointed it at
 * an external origin. In both cases the module must not register its own.
 */
export function hasUserProvidedHandler(nuxt: Nuxt, baseURL: string): boolean {
  return Boolean(
    nuxt.options.serverHandlers.find(handler => handler.route?.startsWith(baseURL))
    || nuxt.options.devServerHandlers.find(handler => handler.route?.startsWith(baseURL))
    || hasProtocol(baseURL, { acceptRelative: true }),
  )
}

export function registerSelfHostedHandler<T extends object>(nitro: Nitro, options: SelfHostedHandlerOptions<T>) {
  const { baseURL, runtimeConfigKey, runtimeOptions, prerenderOptions, isStatic } = options

  nitro.options._config.runtimeConfig = nitro.options._config.runtimeConfig || {}
  nitro.options.runtimeConfig[runtimeConfigKey] = defu(nitro.options.runtimeConfig[runtimeConfigKey], runtimeOptions)

  const handler = {
    route: `${baseURL}/**`,
    middleware: false,
    handler: options.handler,
  } satisfies NitroEventHandler

  if (!isStatic) {
    nitro.options.handlers.push(handler)
  }

  // Prerenderer
  if (!nitro.options.dev) {
    nitro.options._config.runtimeConfig[runtimeConfigKey] = defu(prerenderOptions, runtimeOptions)
    nitro.options._config.handlers!.push(handler)
  }
}
