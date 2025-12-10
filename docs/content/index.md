---
seo:
  title: "Optimized Images for your Nuxt Apps"
  description: Plug-and-play image optimization for Nuxt apps. Resize and
    transform your images using built-in optimizer or your favorite images CDN.
  ogImage: https://image.nuxt.com/social-card.png
---

::the-gradient
::

::u-page-hero
---
orientation: horizontal
---
  :::the-illustration{.hidden.lg:flex}
  :::

#title
Optimized Images for your [Nuxt Apps]{.text-primary}

#description
Plug-and-play image optimization for Nuxt apps. Resize and transform your images using built-in optimizer or your favorite images CDN.

#links
  :::u-button
  ---
  icon: i-ph-rocket-launch-duotone
  size: xl
  to: /get-started/installation
  ---
  Get started
  :::

  :::copy-code-input{source="npx nuxt module add image"}
  :::
::

::u-container
  :::u-page-logos
  ---
  title: Trusted by the best frontend teams
  ---
  #default{unwrap="p"}
  ![OpenAI](https://image.nuxt.com/brands/openai.svg){height="28" preload="" width="104"}![Sephora](https://image.nuxt.com/brands/sephora.svg){height="28" preload="" width="217"}![Hyundai](https://image.nuxt.com/brands/hyundai.svg){height="28" preload="" width="205"}![Gitlab](https://image.nuxt.com/brands/gitlab.svg){height="28" preload="" width="129"}![Emma](https://image.nuxt.com/brands/emma.svg){heiht="28" preload="" width="115"}
  :::
::

::u-page-section
#title
Get the most of your images with :br [dynamic features]{.text-primary}

#features
  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-image-duotone
  to: /usage/nuxt-img
  ---
  #title
  Drop-in Replacement
  
  #description
  Leverage `nuxt-img` and `nuxt-picture` drop-in replacement for the native `img` and `picture` elements.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-crop
  to: /providers/ipx
  ---
  #title
  Built-in Resizer
  
  #description
  Unlock the power of our built-in image resizer and transformer with IPX.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-plug-duotone
  to: /get-started/providers
  ---
  #title
  20+ Providers Supported
  
  #description
  Choose over 20 image providers to optimize your images, no vendor lock-in.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-frame-corners
  to: /usage/nuxt-img#sizes
  ---
  #title
  Responsive Ready
  
  #description
  Nuxt Image dynamically generates responsive sizes. Your visuals adapt effortlessly to every screen size, offering a seamless user experience.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-magic-wand-duotone
  to: /usage/nuxt-img#format
  ---
  #title
  Future-Proof Formats
  
  #description
  Embrace the future of visual optimization with support for modern formats like webp and avif.
  :::

  :::u-page-card
  ---
  spotlight: true
  icon: i-ph-rocket-launch-duotone
  to: /get-started/installation
  ---
  #title
  Streamlined Performance
  
  #description
  Deliver visually stunning content with lightning-fast load times, keeping your audience engaged and delighted.
  :::
::

::u-page-section
---
orientation: horizontal
---
  :::provider-list
  ---
  providers:
    - caisy
    - bunny
    - builderio
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
    - shopify
    - storyblok
    - strapi
    - twicpics
    - unsplash
    - uploadcare
    - vercel
    - weserv
  ---
  :::

#title
Choose your :br [favorite provider]{.text-primary}

#description
Nuxt Image supports multiple providers for high performance. Providers are integrations between Nuxt Image and third-party image transformation services. Each provider is responsible for generating correct URLs for that image transformation service. Nuxt Image can also be configured to work with any external image transformation service.

#links
  :::u-button
  ---
  icon: i-ph-rocket-launch-duotone
  size: xl
  to: /get-started/providers
  ---
  Get started
  :::
::
