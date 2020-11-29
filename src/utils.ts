import path from 'path'
import util from 'util'
import url from 'url'
import defu from 'defu'
import consola from 'consola'
import fetch from 'node-fetch'
import hasha from 'hasha'
import fs from 'fs-extra'
import isHttps from 'is-https'
import requrl from 'requrl'
import upath from 'upath'
import { ModuleOptions, ModuleProvider } from 'types'

const streamPipeline = util.promisify(require('stream').pipeline)

export const logger = consola.withScope('@nuxt/image')

export function tryRequire (id) {
  try {
    const m = require(id)
    return m.default || m
  } catch (_err) {}
}

export async function downloadImage ({ url, name, outDir }) {
  try {
    const response = await fetch(url)
    if (!response.ok) { throw new Error(`unexpected response ${response.statusText}`) }
    await streamPipeline(response.body, fs.createWriteStream(path.join(outDir, name)))
    logger.success('Generated image ' + name)
  } catch (error) {
    logger.error(error.message)
  }
}

export function hash (value: string, length = 6) {
  return hasha(value).substr(0, length)
}

export async function getProviders (nuxt, options: ModuleOptions): Promise<ModuleProvider[]> {
  const providerNames = await fs.readdir(path.resolve(__dirname, './providers'))

  // enrich local provider
  options.local = enrichLocalProvider(nuxt, options.local || {})

  const providers = [
    // official providers
    ...providerNames.map(name => options[name] && [name, options[name]]).filter(Boolean),
    // user custom providers
    ...Object.entries(options.providers)
  ]
  return providers
    .map(([key, provider]) => loadProvider(nuxt, key, provider))
}

export function enrichLocalProvider (nuxt, providerOptions) {
  providerOptions = defu(providerOptions, {
    clearCache: false,
    cacheDir: '~~/node_modules/.cache/nuxt-image',
    sharp: {}
  })

  providerOptions.cacheDir = nuxt.resolver.resolveAlias(providerOptions.cacheDir)

  return providerOptions
}

export function loadProvider (nuxt, key: string, provider: any) {
  if (typeof provider === 'string') {
    provider = { provider }
  } else if (typeof provider === 'object') {
    provider = { options: provider }
  }

  if (!provider.name) {
    provider.name = key
  }
  if (!provider.provider) {
    provider.provider = provider.name
  }
  if (typeof provider.provider === 'string') {
    provider.provider = tryRequire('./providers/' + provider.provider) ||
      nuxt.resolver.requireModule(provider.provider)
  }
  const { middleware, runtime, runtimeOptions } = provider.provider(provider.options)
  // TODO: verify provider.provider and warn+skip if invalid
  return {
    ...provider,
    middleware,
    runtimeOptions,
    runtime: upath.normalize(runtime),
    importName: 'runtime_' + hash(runtime).substr(0, 8)
  }
}
