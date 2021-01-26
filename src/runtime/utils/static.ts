const manifest = {}

function updateManifest () {
  if (typeof window.$nuxt !== 'undefined') {
    const pageImages = (window.$nuxt as any)._pagePayload?.data?.[0]?._img || {}
    Object.assign(manifest, pageImages)
  }
}

export function useManifest (nuxtContext?) {
  if (process.client) {
    updateManifest()

    // merge new manifests on route change
    if (nuxtContext) {
      nuxtContext.app.router.afterEach(updateManifest)
    }

    // make sure manifest is initialized
    (window as any).onNuxtReady(updateManifest)
  }
  return manifest
}
