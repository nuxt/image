# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.6.0](https://github.com/nuxt/image/compare/v0.5.0...v0.6.0) (2021-09-05)


### ⚠ BREAKING CHANGES

* update ipx to 0.8.x

### Features

* add contentful provider ([#398](https://github.com/nuxt/image/issues/398)) ([3eccba6](https://github.com/nuxt/image/commit/3eccba645fb7cc8d04a835a8559e8b9ee1d53103))
* **imgix:** format keys ([#364](https://github.com/nuxt/image/issues/364)) ([ce66fa7](https://github.com/nuxt/image/commit/ce66fa770c0a02381eb17b5e38b62fa08f318210))
* **ipx:** compatible with 0.7.x ([017c335](https://github.com/nuxt/image/commit/017c33514df00267dfa5f05429a573bca39ecc7a))
* **provider:** unsplash ([#357](https://github.com/nuxt/image/issues/357)) ([ad6c1ae](https://github.com/nuxt/image/commit/ad6c1ae3bcff9e9c4096bfab70de195abcb4601d))


### Bug Fixes

* **glide:** prevent adding duplicate base url ([#362](https://github.com/nuxt/image/issues/362)) ([d792e1e](https://github.com/nuxt/image/commit/d792e1eba3b9345dce733fe7b339c2004f929d53))
* **ipx:** default modifiers to _ ([3c18ad8](https://github.com/nuxt/image/commit/3c18ad8bd8d54d1b82ef68538f28cef79b7f54f9))
* move `ipx` to optional dependencies ([#403](https://github.com/nuxt/image/issues/403)) ([0affa9d](https://github.com/nuxt/image/commit/0affa9dbab1c582f27cce9133479517c2a4bd43a))


* update ipx to 0.8.x ([7a75fa0](https://github.com/nuxt/image/commit/7a75fa00c43edbf9b0b9698d50a6c51f694c31fd))

## [0.5.0](https://github.com/nuxt/image/compare/v0.4.17...v0.5.0) (2021-07-01)


### ⚠ BREAKING CHANGES

* prepend router base (#339)

### Features

* support alias ([#348](https://github.com/nuxt/image/issues/348)) ([3d11b87](https://github.com/nuxt/image/commit/3d11b8781bc01667b1b6394ac34f36c57d461f16))
* **imagekit:** add modifiers and improve docs ([#336](https://github.com/nuxt/image/issues/336)) ([d53fda5](https://github.com/nuxt/image/commit/d53fda53df829fd8f5d9c5cd41e0747d2e04b52b))
* validate external domains ([#343](https://github.com/nuxt/image/issues/343)) ([bee0040](https://github.com/nuxt/image/commit/bee00400837b4276bacf73731d56374e3f5ce3a0))


### Bug Fixes

* prepend router base ([#339](https://github.com/nuxt/image/issues/339)) ([2d7a04d](https://github.com/nuxt/image/commit/2d7a04daefdc00abf692d7b8efb27c7f30e24e15))
* **static:** url encoded name included in generated ext ([#340](https://github.com/nuxt/image/issues/340)) ([58dd744](https://github.com/nuxt/image/commit/58dd744d39dc6a0e1f0c2dc89ea13f50efa7c91f))

### [0.4.17](https://github.com/nuxt/image/compare/v0.4.16...v0.4.17) (2021-06-23)


### Bug Fixes

* **pkg:** add missing consola and semver deps ([bc34597](https://github.com/nuxt/image/commit/bc345974da179e3dd7e4c068f59f77720c37c837))

### [0.4.16](https://github.com/nuxt/image/compare/v0.4.15...v0.4.16) (2021-06-23)


### Features

* **imgix:** additional documentation and modifiers ([#316](https://github.com/nuxt/image/issues/316)) ([c90b484](https://github.com/nuxt/image/commit/c90b484208c478823f21368f0626fc253ec31250))


### Bug Fixes

* pass `domains` to runtime options ([#333](https://github.com/nuxt/image/issues/333)) ([33ada92](https://github.com/nuxt/image/commit/33ada92b5a9cfdfdee4353ad88a3190807a6c857)), closes [#324](https://github.com/nuxt/image/issues/324)

### [0.4.15](https://github.com/nuxt/image/compare/v0.4.14...v0.4.15) (2021-06-23)


### Features

* glide provider ([#328](https://github.com/nuxt/image/issues/328)) ([1d85042](https://github.com/nuxt/image/commit/1d8504297e9917efbd7c6df0391507e5e79ead3f))

### [0.4.14](https://github.com/nuxt/image/compare/v0.4.13...v0.4.14) (2021-06-02)


### Features

* **sanity:** sanity provider enhancements ([#301](https://github.com/nuxt/image/issues/301)) ([288997b](https://github.com/nuxt/image/commit/288997bd5aa7a8bc4a8284ad08e6a3b04f733fe8))


### Bug Fixes

* ensure payload includes up-to-date _img ([#303](https://github.com/nuxt/image/issues/303)) ([03ea6fe](https://github.com/nuxt/image/commit/03ea6fe2e7d214550a91ea312b0a79557dc50c60))

### [0.4.13](https://github.com/nuxt/image/compare/v0.4.12...v0.4.13) (2021-05-29)


### Features

* add netlify provider ([#299](https://github.com/nuxt/image/issues/299)) ([003e144](https://github.com/nuxt/image/commit/003e14404789ca17688939104537fab7eee15f0e))

### [0.4.12](https://github.com/nuxt/image/compare/v0.4.11...v0.4.12) (2021-05-27)


### Features

* ipx production support ([#257](https://github.com/nuxt/image/issues/257)) ([f625c92](https://github.com/nuxt/image/commit/f625c9246b90a1aea5ea0175dad025c7ebc5c204))

### [0.4.11](https://github.com/nuxt/image/compare/v0.4.10...v0.4.11) (2021-05-26)


### Bug Fixes

* allow full usage of $img in plugins ([#284](https://github.com/nuxt/image/issues/284)) ([b80f791](https://github.com/nuxt/image/commit/b80f79114fd14c0c7b36e38c867ee8db3e7d6711))

### [0.4.10](https://github.com/nuxt/image/compare/v0.4.9...v0.4.10) (2021-05-17)


### Features

* add prismic provider ([#269](https://github.com/nuxt/image/issues/269)) ([306064b](https://github.com/nuxt/image/commit/306064bc2b330ba38d20a575bdcae5e832959311))


### Bug Fixes

* **vercel:** add default proto for domains (fixes [#277](https://github.com/nuxt/image/issues/277)) ([f501914](https://github.com/nuxt/image/commit/f5019148cc358693817aa1d263316af424d3ef59))
* don't allow undefined values to override defaults ([#274](https://github.com/nuxt/image/issues/274)) ([d2e65f9](https://github.com/nuxt/image/commit/d2e65f904b722b380ff9c1aa6d1617051625c654)), closes [#273](https://github.com/nuxt/image/issues/273)

### [0.4.9](https://github.com/nuxt/image/compare/v0.4.8...v0.4.9) (2021-05-13)


### Features

* add sanity provider ([#164](https://github.com/nuxt/image/issues/164)) ([6483c34](https://github.com/nuxt/image/commit/6483c341e6c62c2871a56404904ec8a17b2df676))
* **vercel:** remove protocol from vercel domains ([086227c](https://github.com/nuxt/image/commit/086227ca5d3c1ea2d6dc424fbcf68b85e48318ce)), closes [#242](https://github.com/nuxt/image/issues/242)


### Bug Fixes

* add guard for `ssrContext` existence ([d8aa3a1](https://github.com/nuxt/image/commit/d8aa3a10668786b56b32b9acc2ae4b03e0653d44)), closes [#258](https://github.com/nuxt/image/issues/258) [#249](https://github.com/nuxt/image/issues/249)
* fix typo regression for height modifier (fixes [#262](https://github.com/nuxt/image/issues/262)) ([9a93f19](https://github.com/nuxt/image/commit/9a93f19363e68421771496085ec0d3e441bb86d2))
* remove lazy loading polyfill in favour of native ([#256](https://github.com/nuxt/image/issues/256)) ([424bd44](https://github.com/nuxt/image/commit/424bd447bcc0eee52cf98a6ebcab67045a929837)), closes [#213](https://github.com/nuxt/image/issues/213) [#190](https://github.com/nuxt/image/issues/190)
* vue-loader support for PascalCase components ([#168](https://github.com/nuxt/image/issues/168)) ([8629e3f](https://github.com/nuxt/image/commit/8629e3f7ac84632992ce05f36356f1c165886e1d))
* **cloudinary:** use `jpg` instead of `jpeg` ([#255](https://github.com/nuxt/image/issues/255)) ([7d49fa8](https://github.com/nuxt/image/commit/7d49fa8de9e5a5437068991b19659558b5db850c)), closes [#254](https://github.com/nuxt/image/issues/254)
* **vercel:** fix vercel auto-detection and provide local vercel mode ([#246](https://github.com/nuxt/image/issues/246)) ([a156c66](https://github.com/nuxt/image/commit/a156c66fc52e2c27e7bf5e439ae8624f108d695d))

### [0.4.8](https://github.com/nuxt/image/compare/v0.4.7...v0.4.8) (2021-04-28)


### Bug Fixes

* **image:** ratio calc regression (fixes [#238](https://github.com/nuxt/image/issues/238)) ([5e28edd](https://github.com/nuxt/image/commit/5e28edd005b76fc4872efc15b9ba9fb7cb75b66d))
* ensure static image map is available on first load ([#236](https://github.com/nuxt/image/issues/236)) ([466d5a8](https://github.com/nuxt/image/commit/466d5a8e4e3146631090455bed9d9952cf34f86e))
* generate static images even if lazy loaded ([#233](https://github.com/nuxt/image/issues/233)) ([5be72a5](https://github.com/nuxt/image/commit/5be72a563e13bbceccfbbc889fb4d4f60bcee68d)), closes [#232](https://github.com/nuxt/image/issues/232)
* vercel provider improvements ([#231](https://github.com/nuxt/image/issues/231)) ([9561daf](https://github.com/nuxt/image/commit/9561dafc3841d66e23123f797ea637f1f7802a8d))

### [0.4.7](https://github.com/nuxt/image/compare/v0.4.6...v0.4.7) (2021-04-23)


### Bug Fixes

* **pkg:** use --ext js to avoid issues with mjs ([a483e14](https://github.com/nuxt/image/commit/a483e14514385b9ddc7cceef2fb8c982c3c6e362))

### [0.4.6](https://github.com/nuxt/image/compare/v0.4.5...v0.4.6) (2021-04-22)


### Features

* `staticFilename` option to customize static image filenames ([#220](https://github.com/nuxt/image/issues/220)) ([975b1a2](https://github.com/nuxt/image/commit/975b1a2c72a60172b0b373036dfa197980b1c32a))
* type improvements ([#222](https://github.com/nuxt/image/issues/222)) ([6dc8aa0](https://github.com/nuxt/image/commit/6dc8aa059b6f12139301cb0c7732743565a877ea))


### Bug Fixes

* **deps:** add missing lru-cache ([0af0bf3](https://github.com/nuxt/image/commit/0af0bf39644c179f7c1cd664f60cdbb3e9aae2ea))

### [0.4.5](https://github.com/nuxt/image/compare/v0.4.4...v0.4.5) (2021-04-19)


### Features

* support cloudinary fetch base url ([#218](https://github.com/nuxt/image/issues/218)) ([31bef1e](https://github.com/nuxt/image/commit/31bef1eb56c2ef5905c209d8000a7cde8597c16d))


### Bug Fixes

* limit static download concurrency ([#217](https://github.com/nuxt/image/issues/217)) ([bb4af1a](https://github.com/nuxt/image/commit/bb4af1a46929bc5a0260b53ffcb0b3dab4aeecc1))

### [0.4.4](https://github.com/nuxt/image/compare/v0.4.3...v0.4.4) (2021-04-10)


### Bug Fixes

* enable default provider for resolving ([18ed241](https://github.com/nuxt/image/commit/18ed241109c0064ddacff9dc6877ce5f4e42139e))

### [0.4.3](https://github.com/nuxt/image/compare/v0.4.2...v0.4.3) (2021-04-10)


### Features

* vercel image provider ([#210](https://github.com/nuxt/image/issues/210)) ([69e4af7](https://github.com/nuxt/image/commit/69e4af749103e730d758f7636ddfce1fee4d55c7))

### [0.4.2](https://github.com/nuxt/image/compare/v0.4.1...v0.4.2) (2021-04-07)


### Features

* add storyblok provider ([#133](https://github.com/nuxt/image/issues/133)) ([cf04f1f](https://github.com/nuxt/image/commit/cf04f1f1c00e6aec3ad23821865788b3c8b4fe86))
* expose vetur helpers ([#195](https://github.com/nuxt/image/issues/195)) ([543e7cf](https://github.com/nuxt/image/commit/543e7cf00c8383e12ba68739ef919aed009d2084))

### [0.4.1](https://github.com/nuxt/image/compare/v0.4.0...v0.4.1) (2021-02-16)


### Features

* allow sizes key to be screen width ([6624440](https://github.com/nuxt/image/commit/6624440ef84588c48f86c217157863b5ffd52706))


### Bug Fixes

* use Math.round for generated width ([8ee9a40](https://github.com/nuxt/image/commit/8ee9a406c993a08d1cdd6ec7d6acaa68dc215fe4))

## [0.4.0](https://github.com/nuxt/image/compare/v0.3.0...v0.4.0) (2021-02-15)


### ⚠ BREAKING CHANGES

* remove nuxt-picture wrapper
* screen based responsive (#182)

### Features

* remove nuxt-picture wrapper ([8d7d84b](https://github.com/nuxt/image/commit/8d7d84b0bf2b8bdf9be5c73d5b968b9a827545f3))
* screen based responsive ([#182](https://github.com/nuxt/image/issues/182)) ([51e2e0a](https://github.com/nuxt/image/commit/51e2e0aa34a46fe7713f6a96db8ba933182ded05))

## [0.3.0](https://github.com/nuxt/image/compare/v0.2.1...v0.3.0) (2021-02-03)


### ⚠ BREAKING CHANGES

* improved $img interface (#169)

### Features

* improved $img interface ([#169](https://github.com/nuxt/image/issues/169)) ([40ab562](https://github.com/nuxt/image/commit/40ab5624f733631298975d76e673923916dd46c6))
* use ipx@0.5.x ([fe92ecf](https://github.com/nuxt/image/commit/fe92ecf0e47d579478123bb777ba07785c184fd0))


### Bug Fixes

* **image:** use defu for options and fix default format ([#166](https://github.com/nuxt/image/issues/166)) ([cf2e9c1](https://github.com/nuxt/image/commit/cf2e9c13755f8eb440df1881b84145693e180f61))
* **plugin:** create static manifest for client hydration ([#162](https://github.com/nuxt/image/issues/162)) ([0b10c22](https://github.com/nuxt/image/commit/0b10c22f1661e6013b1f364365e0e4dd04dfc423))
* **provider:** use resolvePath to resolve aliases as well ([#161](https://github.com/nuxt/image/issues/161)) ([930e192](https://github.com/nuxt/image/commit/930e192f99a5bf2b00c7fb66316d67a062d81417))
* use correct width and handle x2 ([97e3889](https://github.com/nuxt/image/commit/97e3889dcf47aa89d4218c959bec2268ce79a029))
* use ratio in getSizes ([8e5b658](https://github.com/nuxt/image/commit/8e5b658fa51132ad405ea4e09bf2c8d476d9f002))

### [0.2.1](https://github.com/nuxt/image/compare/v0.2.0...v0.2.1) (2021-01-26)


### Bug Fixes

* **nuxt-img:** set key to allow making transitions ([20ed72b](https://github.com/nuxt/image/commit/20ed72b376b6845e6e5fd5fa14f698403c43ea34))

## [0.2.0](https://github.com/nuxt/image/compare/v0.0.4...v0.2.0) (2021-01-25)


### Features

* **nuxt-img:** responsive prop ([#155](https://github.com/nuxt/image/issues/155)) ([3dcee93](https://github.com/nuxt/image/commit/3dcee9322663a10e1e16a7de373c5a483ec2d7b1))
* $img.getSources and better srcset for `<nuxt-picture>` ([36e039b](https://github.com/nuxt/image/commit/36e039b5ada9d917cfb6eea225b188b56b00768f))
* add background prop ([ec8d1ce](https://github.com/nuxt/image/commit/ec8d1ce68bfde46e819311b5e62fe5fb9af097a1))
* allow overiding sharp options ([7df04ca](https://github.com/nuxt/image/commit/7df04ca11eca53ef60074a2fb4aa94ac84870d13))
* allow top level provider options ([7b47d6e](https://github.com/nuxt/image/commit/7b47d6e8ded1e3f78522b300b4543a44f98fbb87))
* allow/disallow remote urls ([0856343](https://github.com/nuxt/image/commit/08563435ab8606409d68c1e214442f201ee88cd8))
* fix full static support ([caaff86](https://github.com/nuxt/image/commit/caaff86daea8adc540524e2deed8cb832893cf6f))
* imagekit provider implementation and tests ([#109](https://github.com/nuxt/image/issues/109)) ([fa8be15](https://github.com/nuxt/image/commit/fa8be154f76194a38afa0ced75e529736a39b95b))
* support modifiers prop for components ([#154](https://github.com/nuxt/image/issues/154)) ([6fe9e8f](https://github.com/nuxt/image/commit/6fe9e8fa87a7f3b905b3bf3f7c20ebc36b027050))
* **nuxt-img:** handle loading=lazy with observer ([abb32a1](https://github.com/nuxt/image/commit/abb32a1e6e814daefe7fd7e7a145405f7687fd7b))
* support `NUXT_IMAGE_PROVIDER` environment variable ([1385eb8](https://github.com/nuxt/image/commit/1385eb8d3304c1c821bb4154519b7e253e177090))
* support assets using remote adapter ([acff75c](https://github.com/nuxt/image/commit/acff75ca54501aa74e12191538ab07bb75f65e7b))
* support providers and presets with props ([189cfb9](https://github.com/nuxt/image/commit/189cfb9d9496d52b184f314c2c10881108fe00aa))
* support types for config ([4d7bf06](https://github.com/nuxt/image/commit/4d7bf065cda9365c88e7485d8d6f5c7d9cac6793))


### Bug Fixes

* add types for pick utility and fix issues with imageOptions ([#156](https://github.com/nuxt/image/issues/156)) ([63aaa8a](https://github.com/nuxt/image/commit/63aaa8ae0c4b5bf0786f5a809f194a4d0eb91b02))
* **img:** handle ststic images in with prod server target ([95dd0c6](https://github.com/nuxt/image/commit/95dd0c6848e14c93e2a6e0d983548044c6d87067))
* clean up `undefined` values ([bf9e040](https://github.com/nuxt/image/commit/bf9e0408f4af2b291ed9c7254bf0c7f46f85f6d4))
* cleanup double slashes outside of provider runtime ([d71b03a](https://github.com/nuxt/image/commit/d71b03aa575264170c79548cd9b6d2b915b73565))
* disable blur filter on custom placeholder ([3f277a3](https://github.com/nuxt/image/commit/3f277a3ea20491dfe13a5e0a85039f95ec34e384))
* do not generate multiple sizes for SVG files ([7e385c3](https://github.com/nuxt/image/commit/7e385c3369ec3b3171f88c51be4437d0e1e75233))
* do not render image without src ([cbeada1](https://github.com/nuxt/image/commit/cbeada1d77244fc234b2a17e1fd2060c72ac3628))
* do not sent data urls to provider ([565445f](https://github.com/nuxt/image/commit/565445f27f03198fd876cdf7916cc0f81dbe02c8))
* improve error readability ([#79](https://github.com/nuxt/image/issues/79)) ([763f215](https://github.com/nuxt/image/commit/763f2152654986d8976f8cefe33364f591ada540))
* merge merge presets with inline modifiers ([164af06](https://github.com/nuxt/image/commit/164af0621556bd4fd106b230ed92c4de69199574))
* opacity ([1220c6a](https://github.com/nuxt/image/commit/1220c6a4f726797f036fc1a469f26480a401be0a))
* parse width and height modifiers ([dd2bf78](https://github.com/nuxt/image/commit/dd2bf786371272252a6edf518f38835be03d00d9))
* remove resolution server middleware ([fc34a73](https://github.com/nuxt/image/commit/fc34a73c71c77904133cb941425b05a790933c0b))
* set correct width and height for svg ([05e3bfe](https://github.com/nuxt/image/commit/05e3bfe87208132beaef3dabefde2f3ea0f273c3))
* sizes as array should overwrites defaults ([339b7dd](https://github.com/nuxt/image/commit/339b7dd9756a7870b28f5c84e53f079a3220621c))
* **cloudinary:** fit types, auto format & quality  ([#76](https://github.com/nuxt/image/issues/76)) ([74ef445](https://github.com/nuxt/image/commit/74ef445b5ffd740e28722fd68a45192234fc52cc))
* **module:** add package name to transpile list as well ([f97b34a](https://github.com/nuxt/image/commit/f97b34aaaaf8ed519d661c19c952e94e21e82d30))
* **picture:** call `getMeta` with current arguments ([d43daf2](https://github.com/nuxt/image/commit/d43daf2b00ebf3bf1402158126a243270fb5e45d))
* **twicpics:** fix minor issues and adds custom operations ([#132](https://github.com/nuxt/image/issues/132)) ([5a4e5d3](https://github.com/nuxt/image/commit/5a4e5d3fc90ac33f3c8262cdb9daa373f4187fc0))
* reduce placeholders quality ([b20a8f9](https://github.com/nuxt/image/commit/b20a8f98c91ebdcf0a0f1c66bcb21ee13fc79833))
* rename `nuxt-image` to `nuxt-img` ([df3b92c](https://github.com/nuxt/image/commit/df3b92c52adc5519911b1535a6c5fc64b1fae1c9))
* sanitize backgroun modifier ([c1f3fb4](https://github.com/nuxt/image/commit/c1f3fb4afb6cb7bd1108ac6a83dc969fb06bb4ae))
* **picture:** show image after load ([709d8e7](https://github.com/nuxt/image/commit/709d8e753410bb813886967e47de56ec295632d0))

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
