import Vue from 'vue'
import NuxtImage from './nuxt-image'

Vue.component('NuxtImage', NuxtImage)

function createObserver() {
    const observer = {}
    function callback(entries, imgObserver) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target
                const callback = this.elementCallbackMap[lazyImage.__unique]
                if (typeof callback === "function") {
                    callback()
                }
                delete this.elementCallbackMap[lazyImage.__unique]
                imgObserver.unobserve(lazyImage)
            }
        })
    }
    return {
        add(target, component, unique) {
            // add unique id to recognize target
            target.__unique = unique || target.id || target.__vue__._uid 
            this.elementCallbackMap[target.__unique] = component;
            this.observer.observe(target)
        },
        remove(target) {
            delete this.elementCallbackMap[target.__unique]
            this.observer.unobserve(target)
        }
    }
}
export class ObserverService {
    constructor() {
        this.observer = new IntersectionObserver(this.callback.bind(this))
        this.elementCallbackMap = {}
    }

    

    
}

export class Image {
    constructor(target = 'client') {
        if (target == 'client') {
            this.$observer = new ObserverService()
        }
    }
    with(src) {
        const _options = {
            src: src,
            options: {},
            [Symbol.toPrimitive]: () => this.generate(_options.src, _options.options),
            toJSON: () => _options
        }
        let handler = {
            get: (target, propKey, receiver) => {
                if (typeof target[propKey] === "function") {
                    return target[propKey]()
                }
                if (['src', 'options'].includes(propKey)) {
                    return target[propKey]
                }
                return function (value) {
                    target.options[propKey] = value
                    return new Proxy(_options, handler)
                };
            }
        };
        return new Proxy(_options, handler);
    }
    generate(provider, src, options) {
        const image = typeof src === "object" ? { ...src } : {
            src,
            options
        }
        return providers.run(provider || '', image)
    }
    async lqip(provider, src, options = {}) {
        const image = typeof src === "object" ? {...src} : {
            src
        }
        return providers.run(provider || '', {
            src: image.src,
            base64: true,
            options: {
                contain: '20x20',
            }
        })
    }
}

export const providers = {
    config: <%=JSON.stringify(options.providers || {})%>,
    run(name, image) {
        name = name || '<%=options.defaultProvider%>'
        return providers[name](providers.config[name], image);
    },
    twicpics(config, image) {
        const { domain } = config
        const modifiers = Object.keys(image.options || {})
            .map(name => `${name}=${image.options[name]}`)
    
        return domain + image.src + '?twic=v1/' + modifiers.join('/')
    }
}