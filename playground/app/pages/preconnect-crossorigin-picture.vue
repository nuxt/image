<template>
  <div>
    <nuxt-picture
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main"
      width="100"
      height="100"
      :img-attrs="{ crossorigin: 'use-credentials' }"
    />
    <nuxt-picture
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main"
      width="120"
      height="120"
      :img-attrs="{ crossorigin: '' }"
    />
  </div>
</template>
