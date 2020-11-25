import Vue from 'vue'
import NuxtImg from '~image/nuxt-img'
import NuxtPicture from '~image/nuxt-picture'
import { createImage } from '~image/image'
import { allowList } from '~image/allowlist'

<%=Object.entries(options.imports).map(([name, path]) => `import ${name} from '${path}'`).join('\n')%>

const intersectOptions = <%= devalue(options.intersectOptions) %>
const defaultProvider = '<%= options.defaultProvider %>'
const responsiveSizes = <%= devalue(options.sizes) %>
const presets = <%= devalue(options.presets) %>
const providers = {}
<% for (provider of options.providers) { %>
// <%= provider.name %>
providers['<%= provider.name %>'] = {
  provider: <%= provider.import %>,
  defaults: <%= JSON.stringify(provider.options || {}, null, 2) %>
}
<% } %>

Vue.component(NuxtImg.name, NuxtImg)
Vue.component(NuxtPicture.name, NuxtPicture)
<% if (features.componentAliases) { %>Vue.component('NImg', NuxtImg)
Vue.component('NPicture', NuxtPicture)<% } %>

const allow = allowList(<%= devalue(options.allow) %>)

export default function (context, inject) {
  const $img = createImage(context, {
    defaultProvider,
    providers,
    presets,
    intersectOptions,
    responsiveSizes,
    allow
  })

  inject('img', $img)
}
