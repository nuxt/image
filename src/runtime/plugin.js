import Vue from 'vue'
import { createImage } from '~image'
import NuxtImg from '~image/components/nuxt-img.vue'
import NuxtPicture from '~image/components/nuxt-picture.vue'
import NuxtDownloadLink from '~image/components/nuxt-download-link.vue'

<%=options.providers.map(p => `import * as ${p.importName} from '${p.runtime}'`).join('\n')%>

const imageOptions = <%= JSON.stringify(options.imageOptions, null, 2) %>

imageOptions.providers = {
<%=options.providers.map(p => `  ['${p.name}']: { provider: ${p.importName}, defaults: ${JSON.stringify(p.runtimeOptions)} }`).join(',\n') %>
}


Vue.component(NuxtImg.name, NuxtImg)
Vue.component(NuxtPicture.name, NuxtPicture)
Vue.component(NuxtDownloadLink.name, NuxtDownloadLink)
Vue.component('NImg', NuxtImg)
Vue.component('NPicture', NuxtPicture)
Vue.component('NDownloadLink', NuxtDownloadLink)

export default function (nuxtContext, inject) {
  const $img = createImage(imageOptions, nuxtContext)
  inject('img', $img)
}
