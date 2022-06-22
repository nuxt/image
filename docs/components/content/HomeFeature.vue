<template>
  <div>
    <div>
      <span
        class="
          flex
          items-center
          justify-center
          h-12
          w-12
          rounded-md
          bg-primary-50
        "
      >
        <!-- Heroicon name: outline/inbox -->
        <Component :is="feature.icon" class="text-primary-900" />
      </span>
    </div>
    <div class="mt-6">
      <h3 class="text-lg font-medium">
        {{ feature.title }}
      </h3>
      <p class="mt-2 text-base" v-html="feature.description" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  feature: {
    type: Object,
    required: true
  }
})
</script>
