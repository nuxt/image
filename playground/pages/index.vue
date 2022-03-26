<script lang="ts" setup>
import { providers as providerList } from '../providers'

const providers = computed(() => providerList)
</script>

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
