const manifest = {}

export function useManifest (nuxtContext?) {
  if (process.client) {
    if (typeof window.$nuxt !== 'undefined') {
      const pageImages = (window.$nuxt as any)._pagePayload?.data?.[0]?._img || {}
      Object.assign(manifest, pageImages)
      return manifest
    }

    // merge new manifests on route change
    if (nuxtContext) {
      nuxtContext.app.router.afterEach(() => useManifest())
    }

    // make sure manifest is initialized
    (window as any).onNuxtReady(useManifest)
  }
  return manifest
}
