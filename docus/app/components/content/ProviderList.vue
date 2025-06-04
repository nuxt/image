<script setup lang="ts">
defineProps<{
  providers: string[]
}>()
</script>

<template>
  <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
    <NuxtLink
      v-for="(provider, index) in providers"
      :key="index"
      :to="`/providers/${provider}`"
      :title="provider"
      class="block lg:hover:scale-110 transition"
    >
      <NuxtImg
        :src="`/providers/${provider}.svg`"
        :alt="provider"
        width="64"
        height="64"
        class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl"
        loading="lazy"
      />
    </NuxtLink>
  </div>
</template>
