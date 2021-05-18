---
title: IPX Provider (static)
description: 'Nuxt Image internally use IPX as static provider.'
navigation:
  title: IPX (static)
---

When no provider is specified globally, the default provider is `static` which uses [IPX](https://github.com/nuxt-contrib/ipx).

IPX is an opensource and self-hosted image optimizer based on [Sharp](https://github.com/lovell/sharp) developed by the Nuxt team.

The image module internally uses IPX for static image optimization but you can also self-host it as a runtime optimizer by enabling the provider.

### Static assets

It's common if you are using a third-party provider that you may want to also include some images
that are stored locally within your repo. 

```vue
<NuxtImg provider="static" src="/logo.png" width="300" height="200" />
```

This will load the image in as `/static/logo.png` and apply the IPX optimizations if applicable.
