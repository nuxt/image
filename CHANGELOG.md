# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.3](https://github.com/nuxt/image/compare/v0.0.2...v0.0.3) (2020-10-05)


### Features

* add fastly provider ([#15](https://github.com/nuxt/image/issues/15)) ([34ceb3c](https://github.com/nuxt/image/commit/34ceb3c4180b7765f87729ed5ae548ac4b3aa114))
* **componets:** introduce `no-script` prop ([eb522b7](https://github.com/nuxt/image/commit/eb522b7e78ddd96ef6eea264cca665ead2ddfeec))


### Bug Fixes

* **runtime:** fix runtime behavior ([0ed7625](https://github.com/nuxt/image/commit/0ed76251335750fb679bc1e0877de55ef908f257))
* **runtime:** rename `size` prop to `fit` ([6174417](https://github.com/nuxt/image/commit/6174417935f7a2cc05a67032fb7d03909a27325b)), closes [#16](https://github.com/nuxt/image/issues/16)
* **runtime:** use file name from `src` if `alt` prop is missing ([19e6157](https://github.com/nuxt/image/commit/19e615763163c5e6c56dca5e6591bdc5adad741b))

### [0.0.2](https://github.com/nuxt/image/compare/v0.0.1...v0.0.2) (2020-10-02)


### Bug Fixes

* improvements to make it work with Nuxt content ([46cc0e2](https://github.com/nuxt/image/commit/46cc0e21e853ad98db185da37375311963ec7716))

### 0.0.1 (2020-10-02)


### Features

* **img:** support `<img>` attributes ([9ed71da](https://github.com/nuxt/image/commit/9ed71dae8f61b5fcae3276329dbb17408ef37c60))
* preserve images name on generation ([3f789fc](https://github.com/nuxt/image/commit/3f789fc504fd88187424c6961bb384c4dbbdd9ec))
* support `clearCache` on local provider ([ba239a4](https://github.com/nuxt/image/commit/ba239a4eb8f3fdcfef0d11e1e7cdf89d5cf31465))
* support remote urls ([fd4184b](https://github.com/nuxt/image/commit/fd4184beefd71a926113917b6f370401db559cd8))
* **generate:** generate local file on static generation ([0f46395](https://github.com/nuxt/image/commit/0f463953a27514407060334cd8c60e3216892320))
* **picture:** init nuxt-picture ([bce1645](https://github.com/nuxt/image/commit/bce164532a555764947bac898839f0b2add42387))
* **srcset:** introduce `sets` props to create srcset ([e330900](https://github.com/nuxt/image/commit/e330900b002c02a5b2fde960a99e9366dc1cb67d))
* user-defined presets ([3e7b1cf](https://github.com/nuxt/image/commit/3e7b1cf3521c60fbe12c7a160c9c82cfd044b382))


### Bug Fixes

* **full-static:** find hashed images from page payload ([f7512c7](https://github.com/nuxt/image/commit/f7512c7e8c0c5c381d67e8288a57040182d1a827))
* **local:** remove baseUrl from provider options ([e0ec956](https://github.com/nuxt/image/commit/e0ec9561a360880e6c3cf1662998e4bf98a0570e))
* **provider:** normalize runtime paths to support windows ([df9470f](https://github.com/nuxt/image/commit/df9470f8cbaf738df428761ac473f0c6d791be5a))
* **runtime:** global nuxt variable to load page payload ([1869b0d](https://github.com/nuxt/image/commit/1869b0d68e49aeaf64b8998c0f6617b76c633568))
* use router base in generated images ([28ed0f2](https://github.com/nuxt/image/commit/28ed0f27c06fc7e10cf7e073d5eb2abd875a0c85))
* **sets-prop:** use width if breakpoint is missing ([d1f62df](https://github.com/nuxt/image/commit/d1f62df288cec4537b7d29a38f63f6d172bba2ab))
