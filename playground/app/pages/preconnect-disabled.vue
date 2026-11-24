<template>
  <div>
    <!-- opts out of the global `image.preconnect` option -->
    <nuxt-img
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main"
      width="100"
      height="100"
      :preconnect="false"
    />
  </div>
</template>
