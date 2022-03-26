
import { createImage} from '~image'

<%=options.providers.map(p => `import * as ${p.importName} from '${p.runtime}'`).join('\n')%>

const imageOptions = <%= JSON.stringify(options.imageOptions, null, 2) %>

imageOptions.providers = {
<%=options.providers.map(p => `  ['${p.name}']: { provider: ${p.importName}, defaults: ${JSON.stringify(p.runtimeOptions)} }`).join(',\n') %>
}

export default function (nuxtContext, inject) {
  const $img = createImage(imageOptions, nuxtContext)

  if (process.static && process.server) {
    nuxtContext.beforeNuxtRender(({ nuxtState }) => {
      const ssrData = nuxtState.data[0] || {}
      ssrData._img = nuxtState._img || {}
    })
  }
  
  inject('img', $img)
}
