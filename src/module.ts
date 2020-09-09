import path from 'path'
import hash from 'hasha'
import fs from 'fs-extra'
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
            baseURL: '/_image/local',
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

    handleStaticGeneration(nuxt, providers)
}

function handleStaticGeneration(nuxt: any, providers: ModuleProvider[]) {
    const { dir } = nuxt.options.generate
    const generators = {}

    function findGenerator(imageProvider) {
        if (!generators[imageProvider]) {
            const matchedProvider = providers.find(p => p.name == imageProvider);
            if (matchedProvider) {
                const { generator } = matchedProvider.provider(matchedProvider.options);
                if (typeof generator === "function") {
                    generators[imageProvider] = generator();
                }
            }
        }
        if (!generators[imageProvider]) {
            throw new Error(`"${imageProvider}" provider does not have proper generator`)
        }
        return generators[imageProvider]
    }

    // Generate single image
    async function generateImage(image) {
        const imagePath = dir + image
        const [_, imageProvider, imageUrl] = image.match(/\/_image\/(\w+)(\/.*)/)
        try {
            const imageGenerator = findGenerator(imageProvider);
            const data = await imageGenerator(imageUrl)
            await fs.ensureDir(path.dirname(imagePath))
            await fs.writeFile(imagePath, data, "binary")
            logger.success("Generated image " + image)
        } catch (error) {
            logger.error(error.message)
        }
    }

    nuxt.hook('generate:page', async (page) => {
        const images = page.html.match(/\/_image[^\"\s]+/g)
        await Promise.all(images.map(generateImage))
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
