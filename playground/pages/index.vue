<template>
  <div>
    <h2>Providers</h2>
    <ul>
      <li v-for="p in providers" :key="p.name">
        <NuxtLink :to="`/provider/${p.name}`">
          {{ p.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { providers } from '../providers'

export default {
  computed: {
    providers: () => providers
  }
}
</script>
