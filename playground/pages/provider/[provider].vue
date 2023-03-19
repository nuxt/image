<template>
  <div>
    <div v-if="provider">
      <h1>{{ provider.name }}</h1>
      <br>
      <div class="providerShowcase">
        <div v-for="sample of provider.samples" :key="sample.src">
          <nuxt-img :provider="provider.name" v-bind="sample" />
          <pre>{{ sample }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { providers } from '../../providers'

export default {
  validate ({ params }) {
    return Boolean(providers.find(p => p.name === params.provider))
  },
  computed: {
    providers: () => providers,
    provider () {
      const providerName = this.$route.params.provider || 'default'
      const p = providers.find(p => p.name === providerName)
      if (!p) {
        return null
      }
      return p
    }
  }
}
</script>

<style scoped>
img {
  max-width: 80vw;
  height: auto;
}
</style>
