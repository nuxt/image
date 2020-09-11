import path from 'path'
import hash from 'hasha'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import util from 'util'
import { ModuleOptions, ProviderFactory } from './types'
import { logger } from './utils'

const { name, version } = require('../package.json')

interface ModuleProvider {
    name: string,
    options: any
    provider: ProviderFactory
}

async function ImageModule (moduleOptions) {
    const { nuxt, addServerMiddleware, addPlugin } = this

    const options: ModuleOptions = {
        presets: [],
        ...nuxt.options.image,
        ...moduleOptions
    }

    // Ensure at least one provider is set
    if (!options.providers || !Object.keys(options.providers).length) {
        options.providers = { local: {} }
    }

    // Add default `lqip` preset
    if (!options.presets.some(preset => preset.name === 'lqip')) {
        options.presets.unshift({
            name: 'lqip',
            modifiers: {
              width: 30
            }
        })
    }

    // Apply local defaults
    if (options.providers.local) {
        options.providers.local = {
            dir: path.join(nuxt.options.srcDir, 'static'),
            ...options.providers.local
        }
    }

    if (!options.defaultProvider) {
        options.defaultProvider = Object.keys(options.providers)[0]
    }

    const providers: ModuleProvider[] = []

    for (let [key, provider] of Object.entries(options.providers)) {
        if (Array.isArray(provider)) {
            provider = {
                provider: provider[0],
                options: provider[1]
            }
        } else if (typeof provider === 'string') {
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
            provider.provider = tryRequire('./providers/' + provider.provider) 
            || nuxt.resolver.requireModule(provider.provider)
        }
        // TODO: verify provider.provider and warn+skip if invalid
        providers.push(provider)
    }

    const pluginOptions = {
        defaultProvider: options.defaultProvider,
        imports: {} as { [name: string]: string },
        providers: [] as {  name: string, import: string, options: any }[],
        presets: options.presets
    }

    for (const p of providers) {
        const { middleware, runtime, runtimeOptions } = p.provider(p.options)
        const importName = 'runtime_' + hash(runtime).substr(0, 8)
        pluginOptions.imports[importName] = runtime
        pluginOptions.providers.push({
            name: p.name,
            import: importName,
            options: runtimeOptions
        })

        if (typeof middleware === "function") {
            addServerMiddleware({
                path: '/_image/' + p.name,
                handler: middleware()
            })
        }
    }

    addPlugin({
        fileName: 'image.js',
        src: path.resolve(__dirname, '../templates/plugin.js'),
        options: pluginOptions
    })

    // Transpile and alias image src
    nuxt.options.alias['~image'] = __dirname
    nuxt.options.build.transpile.push(__dirname)

    nuxt.hook("generate:before", () => {
        handleStaticGeneration(nuxt, providers)
    })
}

function handleStaticGeneration(nuxt: any, providers: ModuleProvider[]) {
    const { dir: generateDir } = nuxt.options.generate
    const streamPipeline = util.promisify(require('stream').pipeline)
    const downloadList = {}

    // Generate single image
    async function generateImage({ url, staticUrl }) {
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
            await streamPipeline(response.body, fs.createWriteStream(path.join(generateDir, staticUrl)))
            logger.success("Generated image " + staticUrl)
        } catch (error) {
            logger.error(error.message)
        }
    }

    nuxt.hook('vue-renderer:ssr:templateParams', (templateParams, renderContext) => {
        const { staticImages = [] } = renderContext
        staticImages.map(({ url, staticUrl }) => {
            downloadList[url] = staticUrl;
        })
    })

    nuxt.hook('generate:done', async () => {
        const host = 'http://localhost:' + nuxt.server.listeners[0].port
        
        try { await fs.mkdir(path.join(generateDir, '_image')) } catch {}

        const downloads = Object.entries(downloadList)
            .map(([url, staticUrl]) => generateImage({
                url: host + url,
                staticUrl
            }))
        await Promise.all(downloads)
        
    })
}

function tryRequire(id) {
    try {
        const m = require(id)
        return m.default || m
    } catch(_err) {}
}

ImageModule.meta = { name, version }

export default ImageModule
