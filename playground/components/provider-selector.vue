<template>
  <select v-model="providerName">
    <option value="">
      provider demo
    </option>

    <option
      v-for="p in providers"
      :key="p.name"
      :value="p.name"
    >
      {{ p.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { providers } from '../providers'

const route = useRoute()
const router = useRouter()

const providerName = computed({
  get() {
    return route.params.provider || ''
  },
  set(provider) {
    if (provider) {
      router.push(`/provider/${provider}`)
    }
  },
})
</script>
