---
title: Nuxt Image
description: Plug-and-play image optimization for Nuxt apps. Resize and transform your images using the built-in optimizer or your favorite images CDN.
navigation:
  title: Quick Start
---

# Introduction

Nuxt Image adds `<NuxtImg>` and `<NuxtPicture>` components to your app: drop-in replacements for the native `img` and `picture` elements that resize, transform and serve optimized images, with the built-in optimizer or the image CDN you already use.

- **Drop-in replacement**: use [`<NuxtImg>`](/modules/image/usage/nuxt-img) and [`<NuxtPicture>`](/modules/image/usage/nuxt-picture) where you would write `<img>` and `<picture>`.
- **Built-in resizer**: optimize local and remote images with [IPX](/modules/image/providers/ipx), the default provider, with no configuration.
- **40+ providers supported**: switch to any of the built-in [providers](/modules/image/providers) or [write your own](/modules/image/advanced/custom-provider), with no vendor lock-in.
- **Responsive ready**: generate [responsive sizes](/modules/image/usage/nuxt-img#sizes) so your visuals adapt to every screen.
- **Modern formats**: [convert images](/modules/image/usage/nuxt-img#format) to `webp` or `avif` for the browsers that support them.

::tip
Try it online in the [Nuxt Image playground](https://stackblitz.com/github/nuxt/image/tree/main/example) on StackBlitz.
::

::note
You are reading the `v2` documentation compatible with **Nuxt 3.1+**. Check out [v0.image.nuxtjs.org](https://v0.image.nuxtjs.org/getting-started/installation) for the **Nuxt 2** compatible version ([Announcement](https://github.com/nuxt/image/discussions/548)).
::

## Automatic Installation

To get started, add `@nuxt/image` to your project:

```bash
npx nuxt module add image
```

## Manual Installation

Add `@nuxt/image` dependency to your project:

::code-group

```bash [npm]
npm i @nuxt/image
```

```bash [yarn]
yarn add @nuxt/image
```

```bash [pnpm]
pnpm add @nuxt/image
```

```bash [bun]
bun add @nuxt/image
```

::

Then, add it to the `modules` in your `nuxt.config`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
    '@nuxt/image'
  ]
})
```

## Sharp Cross-Platform Installation

The default [IPX](/modules/image/providers/ipx) provider uses [sharp](https://sharp.pixelplumbing.com) for image processing. At install time, your package manager downloads prebuilt sharp binaries **only for your current OS and CPU architecture**. This means if you build on macOS or Windows and deploy to a Linux server (or build on x64 and deploy to ARM64), the required sharp binaries might be missing, resulting in errors like:

```
[500] [IPX_ERROR] Could not load the "sharp" module using the linux-x64 runtime
```

To fix this, configure your package manager to install sharp binaries for **all target platforms**, e.g.:

::code-group

```json [pnpm (package.json)]
{
  "pnpm": {
    "supportedArchitectures": {
      "os": ["current", "linux"],
      "cpu": ["current", "x64", "arm64"]
    }
  }
}
```

```yaml [yarn (.yarnrc.yml, v3+ only)]
supportedArchitectures:
  os:
    - current
    - linux
  cpu:
    - current
    - x64
    - arm64
```

```bash [npm]
npm install --cpu=x64 --os=linux sharp
npm install --cpu=arm64 --os=linux sharp
```

::

After updating the configuration, reinstall dependencies to download the additional platform binaries.

For more details, see the [sharp cross-platform documentation](https://sharp.pixelplumbing.com/install/#cross-platform).

## Configuration

Add an `image` section in your `nuxt.config`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    // Options
  }
})
```

::tip
Checkout the [image configuration](/modules/image/configuration) for all available options and features to customize.
::

## Edge Channel

After each commit is merged into the `main` branch of `@nuxt/image` and **passing all tests**, we trigger an automated npm release using GitHub Actions publishing a [`@nuxt/image-nightly`](https://npmjs.com/package/@nuxt/image-nightly) package.

You can opt in to use this release channel and avoid waiting for the next release and helping the module by beta testing changes.

The build and publishing method and quality of edge releases are the same as stable ones. The only difference is that you should often check the [GitHub repository](https://github.com/nuxt/image) for updates. There is a slight chance of regressions not being caught during the review process and by the automated tests. Therefore, we internally use this channel to double-check everything before each release.

### Opting into the edge channel

Update `@nuxt/image` dependency inside `package.json`:

```diff [package.json]
{
  "devDependencies": {
-   "@nuxt/image": "^1.0.0"
+   "@nuxt/image": "npm:@nuxt/image-nightly@latest"
  }
}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.

### Opting out from the edge channel

Update `@nuxt/image` dependency inside `package.json`:

```diff [package.json]
{
  "devDependencies": {
-   "@nuxt/image": "npm:@nuxt/image-nightly@latest"
+   "@nuxt/image": "^1.0.0"
  }
}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.

## Troubleshooting

If an error occurs during installation:

- Ensure using LTS version of NodeJS ([NodeJS Download page](https://nodejs.org/en/download))
- Try to upgrade to latest versions:

::code-group

```bash [npm]
npm up @nuxt/image
```

```bash [yarn]
yarn upgrade @nuxt/image
```

```bash [pnpm]
pnpm up @nuxt/image
```

```bash [bun]
bun update @nuxt/image
```

::

- Try recreating lockfile:

```bash
npx nuxt upgrade --force
```

- If none of the above worked, please [open an issue](https://github.com/nuxt/image/issues) and include error trace, OS, Node version and the package manager used for installing.
