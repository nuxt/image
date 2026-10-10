<template>
  <div>
    <NuxtImg
      src="/images/colors.jpg"
      alt=""
    />
    <NuxtPicture
      src="/images/colors.jpg"
      alt=""
    />
    <!-- @vue-expect-error `alt` is required when `image.requireAlt` is enabled -->
    <NuxtImg src="/images/colors.jpg" />
    <!-- @vue-expect-error `alt` is required when `image.requireAlt` is enabled -->
    <NuxtPicture src="/images/colors.jpg" />
  </div>
</template>
