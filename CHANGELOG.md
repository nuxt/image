# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.5](https://github.com/nuxt/image/compare/v0.0.4...v0.0.5) (2020-12-21)


### Features

* allow overiding sharp options ([7df04ca](https://github.com/nuxt/image/commit/7df04ca11eca53ef60074a2fb4aa94ac84870d13))


### Bug Fixes

* **package:** removed file filter ([78a31c5](https://github.com/nuxt/image/commit/78a31c5b7a421e8dad4aaef3d2ae623fe787e5eb))
* **payload:** async hydrated components have access to image payload ([2849ed3](https://github.com/nuxt/image/commit/2849ed3f1e8e271878f8da3c53a526227b9e1129))
* do not render image without src ([cbeada1](https://github.com/nuxt/image/commit/cbeada1d77244fc234b2a17e1fd2060c72ac3628))
* improve error readability ([#79](https://github.com/nuxt/image/issues/79)) ([763f215](https://github.com/nuxt/image/commit/763f2152654986d8976f8cefe33364f591ada540))
* **cloudinary:** fit types, auto format & quality  ([#76](https://github.com/nuxt/image/issues/76)) ([74ef445](https://github.com/nuxt/image/commit/74ef445b5ffd740e28722fd68a45192234fc52cc))
* reduce placeholders quality ([b20a8f9](https://github.com/nuxt/image/commit/b20a8f98c91ebdcf0a0f1c66bcb21ee13fc79833))

### [0.0.4](https://github.com/nuxt/image/compare/v0.0.2...v0.0.4) (2020-11-10)


### Features

* a11y ([1732d62](https://github.com/nuxt/image/commit/1732d6228b10ecb3b7ca1939ec37f706739b2180))
* add `cacheDir` options ([449a005](https://github.com/nuxt/image/commit/449a00561080c6b654eccf07c7db43ef6c8a8e24))
* add click listener ([cbe2351](https://github.com/nuxt/image/commit/cbe2351b9da0ac5d021942455e99c7db474aacb6))
* add component aliases ([845579b](https://github.com/nuxt/image/commit/845579bf9d7b324712bf11f54d89a205853fd7a3))
* add fastly provider ([#15](https://github.com/nuxt/image/issues/15)) ([34ceb3c](https://github.com/nuxt/image/commit/34ceb3c4180b7765f87729ed5ae548ac4b3aa114))
* add module option to modify `IntersectionObserver` options ([#41](https://github.com/nuxt/image/issues/41)) ([9f9b920](https://github.com/nuxt/image/commit/9f9b920c18c76227d15981be5f465b46da8183d8))
* auto detect image ratio ([#37](https://github.com/nuxt/image/issues/37)) ([0f6e17e](https://github.com/nuxt/image/commit/0f6e17ea986925f7a5728a0e098c526bc9d7a137))
* inline styles ([#67](https://github.com/nuxt/image/issues/67)) ([6909267](https://github.com/nuxt/image/commit/690926736cd7cc7e7ffbe362bee5cbd25346f328))
* keep internal provider enable ([#60](https://github.com/nuxt/image/issues/60)) ([349b40a](https://github.com/nuxt/image/commit/349b40aea54d2d99274892bb0f261f34ee47a612))
* load all images on print ([#66](https://github.com/nuxt/image/issues/66)) ([2c034de](https://github.com/nuxt/image/commit/2c034de136780c82f1330205248f1ac95640b7f4))
* support responsive prop to generate sizes ([7e3f80b](https://github.com/nuxt/image/commit/7e3f80ba798eee2c267d77fb68b8b4cd16704866))
* universal meta resolving ([#55](https://github.com/nuxt/image/issues/55)) ([45bbbe9](https://github.com/nuxt/image/commit/45bbbe9858da7f16c6f95c499dcb144874505e97))
* **componets:** introduce `no-script` prop ([eb522b7](https://github.com/nuxt/image/commit/eb522b7e78ddd96ef6eea264cca665ead2ddfeec))
* **runtime:** add imgix provider ([#29](https://github.com/nuxt/image/issues/29)) ([3f4a6a5](https://github.com/nuxt/image/commit/3f4a6a5dd0bca5d16d7a69e66f20cd13c97291e7))
* **runtime:** catch image exceptions and prevent page crash ([#43](https://github.com/nuxt/image/issues/43)) ([e5190c1](https://github.com/nuxt/image/commit/e5190c18fea142db5e41176a669b00c358a740b8))


### Bug Fixes

* ensure component needs placeholder ([029f2cf](https://github.com/nuxt/image/commit/029f2cfaf40c654cd924324c19b473c1b5229fd7))
* image ratio calculation ([b88bb9c](https://github.com/nuxt/image/commit/b88bb9c8e29d8064420ac1277649a0a7e5f6661a))
* rename default provider's option ([c1509fb](https://github.com/nuxt/image/commit/c1509fb45674f7a02aef10de1dbfc0a8a89be886))
* resolve cache dir aliases ([5303699](https://github.com/nuxt/image/commit/5303699a0bd90df87796573aaac098d4cc1a169f))
* tests & typo ([6f06e65](https://github.com/nuxt/image/commit/6f06e657a60816b740ca004d79a15588f229710c))
* **local-provider:** resolve input dir alias ([0a612d5](https://github.com/nuxt/image/commit/0a612d5dd4f98c3e87625e964762c7a398a0fd62)), closes [#47](https://github.com/nuxt/image/issues/47)
* **runtime:** fix runtime behavior ([0ed7625](https://github.com/nuxt/image/commit/0ed76251335750fb679bc1e0877de55ef908f257))
* **runtime:** handle ssr false ([27c3445](https://github.com/nuxt/image/commit/27c3445fe39c14e7ed06873b88bfe625eaebb56d))
* **runtime:** rename `size` prop to `fit` ([6174417](https://github.com/nuxt/image/commit/6174417935f7a2cc05a67032fb7d03909a27325b)), closes [#16](https://github.com/nuxt/image/issues/16)
* **runtime:** use file name from `src` if `alt` prop is missing ([19e6157](https://github.com/nuxt/image/commit/19e615763163c5e6c56dca5e6591bdc5adad741b))

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
