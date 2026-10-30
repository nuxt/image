<template>
  <div>
    <!-- renders a cross-origin image without opting in to preconnect -->
    <nuxt-img
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main"
      width="100"
      height="100"
    />
  </div>
</template>
