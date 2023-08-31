import { defineNuxtModule, useNuxt } from 'nuxt/kit'
import defu from 'defu'

export default defineNuxtModule({
  meta: { name: 'components-chunk' },
  setup() {
    const nuxt = useNuxt()

    const nonGlobals = new Set([
      'ContentList',
      'ContentNavigation',
      'ContentQuery',
      'ContentRenderer',
      'ContentRendererMarkdown',
      'ContentSlot',
      'DocumentDrivenEmpty',
      'DocumentDrivenNotFound',
      'Markdown',
    ])

    nuxt.hook('components:extend', components => {
      for (const component of components) {
        if (nonGlobals.has(component.pascalName)) {
          component.global = false
        }
    
        // Related to https://github.com/nuxt/nuxt/pull/22558
        // Adding all global components to the main entry
        // To avoid lagging during page navigation on client-side
        // Downside: bigger JS bundle
        // With sync: 465KB, gzip: 204KB
        // Without: 418KB, gzip: 184KB
        if (component.global) {
          component.global = 'sync'
        }
      }
    })
  },
})
