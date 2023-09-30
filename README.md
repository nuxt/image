[![nuxt-image-social-card](https://github-production-user-asset-6210df.s3.amazonaws.com/904724/261574805-5af726c5-0113-4676-9ee9-c464393caee0.png)](https://image.nuxt.com)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![Volta][volta-src]][volta-href]

# Nuxt Image

Plug-and-play image optimization for Nuxt apps. Resize and transform your images using built-in optimizer or your favorite images CDN.

- [📖 &nbsp;Read Documentation](https://image.nuxt.com)
- [👾 &nbsp;Playground](https://stackblitz.com/github/nuxt/image/tree/main/example)

## Features

- `<nuxt-img>` drop-in replacement for the native <img> element
- `<nuxt-picture>` drop-in replacement for the native <picture> element.
- Built-in image resizer and transformer with [unjs/ipx](https://github.com/unjs/ipx)
- Support 20+ providers
- Generate responsive sizes
- Optimize using modern formats such as webp and avif
- [... and more](https://image.nuxtjs.org)

## Nuxt 2

**Note:** This branch is for **Nuxt 3** compatible module. Checkout [`v0` branch](https://github.com/nuxt/image/tree/v0) for **Nuxt 2** support. ([Announcement](https://github.com/nuxt/image/discussions/548))

### Contributing

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run `pnpm dev:prepare` to generate type stubs.
- Use `pnpm dev` to start [playground](./playground) in development mode.

## 📑 License

Published under the [MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/image/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt/image/v/rc

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt/image.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxt/image/v/rc

[license-src]: https://img.shields.io/npm/l/@nuxt/image.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxt/image/v/rc

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

[volta-src]: https://user-images.githubusercontent.com/904724/209143798-32345f6c-3cf8-4e06-9659-f4ace4a6acde.svg
[volta-href]: https://volta.net/nuxt/image?utm_source=nuxt_image_readme
