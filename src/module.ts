import path from 'path'
import { parse } from 'querystring'
import hash from 'hasha'

import { name, version } from '../package.json'
import { ModuleOptions, Provider, ProviderFactory } from './types'

async function ImageModule (moduleOptions) {
    const { nuxt, addServerMiddleware, addPlugin } = this

    const options: ModuleOptions = {
        ...nuxt.options.image,
        ...moduleOptions
    }

    // Ensure at least one provider is set
    if (!options.providers || !Object.keys(options.providers).length) {
        options.providers = { local: {} }
    }

    // Apply local defaults
    if (options.providers.local) {
        options.providers.local = {
            dir: path.join(nuxt.options.srcDir, 'static'),
            baseURL: '/_image/local',
            ...options.providers.local
        }
    }

    if (!options.defaultProvider) {
        options.defaultProvider = Object.keys(options.providers)[0]
    }

    const providers: {
        name: string,
        options: any
        provider: ProviderFactory
    }[] = []

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
        providers: [] as {  name: string, import: string, options: any }[]
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
                handler: middleware
            })
        }
    }
    console.log(pluginOptions);
    addPlugin({
        fileName: 'image.js',
        src: path.resolve(__dirname, '../templates/plugin.js'),
        options: pluginOptions
    })

    // Transpile and alias auth src
    nuxt.options.alias['~image'] = __dirname
    nuxt.options.build.transpile.push(__dirname)
}

function tryRequire(id) {
    try {
        const m = require(id)
        return m.default || m
    } catch(_err) {}
}

ImageModule.meta = { name, version }

export default ImageModule
