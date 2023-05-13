<template>
  <select v-model="providerName">
    <option value="">
      provider demo
    </option>
    <option v-for="p in providers" :key="p.name" :value="p.name">
      {{ p.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { providers } from '../providers'

export default {
  computed: {
    providers: () => providers,
    providerName: {
      get () {
        return this.$route.params.provider || ''
      },
      set (provider: string) {
        if (provider) {
          this.$router.push(`/provider/${provider}`)
        }
      }
    }
  }
}
</script>
