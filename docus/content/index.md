---
seo:
  title: "Nuxt Image: Optimized Images for your Nuxt Apps"
  description: Plug-and-play image optimization for Nuxt apps. Resize and transform your images using built-in optimizer or your favorite images CDN.
  ogImage: https://image.nuxt.com/social-card.png
---

::the-gradient
::

::u-page-hero{orientation="horizontal"}

:::the-illustration{class="hidden lg:flex"}
:::

#title
Optimized Images for your [Nuxt Apps]{.text-primary}

#description
Plug-and-play image optimization for Nuxt apps. Resize and transform your images using built-in optimizer or your favorite images CDN.

#links
:::u-button
---
to: /get-started/installation
icon: i-ph-rocket-launch-duotone
size: xl
---
Get started
:::

:::copy-code-input{source="npx nuxi@latest module add image"}
:::

::

::u-container
  :::u-page-logos{title="Trusted by the best frontend teams"}
  #default{unwrap="p"}
  ![OpenAI](https://image.nuxt.com/brands/openai.svg){width="104" height="28" preload}
  ![Sephora](https://image.nuxt.com/brands/sephora.svg){width="217" height="28" preload}
  ![Hyundai](https://image.nuxt.com/brands/hyundai.svg){width="205" height="28" preload}
  ![Gitlab](https://image.nuxt.com/brands/gitlab.svg){width="129" height="28" preload}
  ![Emma](https://image.nuxt.com/brands/emma.svg){width="115" heiht="28" preload}
  :::
::

::u-page-section
#title
Get the most of your images with :br [dynamic features]{.text-primary}

#features
  :::u-page-card
  ---
  icon: i-ph-image-duotone
  to: /usage/nuxt-img
  :spotlight: true
  ---
  #title
  Drop-in Replacement
  
  #description
  Leverage `nuxt-img` and `nuxt-picture` drop-in replacement for the native `img` and `picture` elements.
  :::

  :::u-page-card
  ---
  icon: i-ph-crop
  to: /providers/ipx
  :spotlight: true
  ---
  #title
  Built-in Resizer

  #description
  Unlock the power of our built-in image resizer and transformer with IPX.
  :::

  :::u-page-card
  ---
  icon: i-ph-plug-duotone
  to: /get-started/providers
  :spotlight: true
  ---
  #title
  20+ Providers Supported

  #description
  Choose over 20 image providers to optimize your images, no vendor lock-in.
  :::

  :::u-page-card
  ---
  icon: i-ph-frame-corners
  to: /usage/nuxt-img#sizes
  :spotlight: true
  ---
  #title
  Responsive Ready

  #description
  Nuxt Image dynamically generates responsive sizes. Your visuals adapt effortlessly to every screen size, offering a seamless user experience.
  :::

  :::u-page-card
  ---
  icon: i-ph-magic-wand-duotone
  to: /usage/nuxt-img#format
  :spotlight: true
  ---
  #title
  Future-Proof Formats

  #description
  Embrace the future of visual optimization with support for modern formats like webp and avif.
  :::

  :::u-page-card
  ---
  icon: i-ph-rocket-launch-duotone
  to: /get-started/installation
  :spotlight: true
  ---
  #title
  Streamlined Performance

  #description
  Deliver visually stunning content with lightning-fast load times, keeping your audience engaged and delighted.
  :::
::

::u-page-section{orientation="horizontal"}
#title
Choose your :br [favorite provider]{.text-primary}

#description
Nuxt Image supports multiple providers for high performance. Providers are integrations between Nuxt Image and third-party image transformation services. Each provider is responsible for generating correct URLs for that image transformation service. Nuxt Image can also be configured to work with any external image transformation service.

#links
:::u-button
---
to: /get-started/providers
icon: i-ph-rocket-launch-duotone
size: xl
---
Get started
:::

#default
:::provider-list
---
providers:
  - caisy
  - bunny
  - cloudflare
  - cloudimage
  - cloudinary
  - directus
  - fastly
  - filerobot
  - glide
  - gumlet
  - hygraph
  - imageengine
  - imagekit
  - imgix
  - ipx
  - netlify
  - prepr
  - prismic
  - sanity
  - storyblok
  - strapi
  - twicpics
  - unsplash
  - uploadcare
  - vercel
  - weserv
---
:::
::
