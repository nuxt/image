<template>
  <main>
    <ul>
      <li>
        <NuxtLink to="/">
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/picture">
          Picture
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/playground">
          Playground
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/instagram">
          Instagram
        </NuxtLink>
      </li>
      <li>
        <select v-model="selectedProvider">
          <option value="">
            Provider fixtures
          </option>
          <option value="">
            --
          </option>
          <option v-for="provider in providers" :key="provider" :value="provider">
            {{ provider }}
          </option>
        </select>
      </li>
    </ul>
    <Nuxt />
  </main>
</template>

<script>
export default {
  data: () => ({
    providers: [
      'cloudinary',
      'fastly',
      'imagekit',
      'imgix',
      'static',
      'twicpics',
      'storyblok',
      'vercel'
    ]
  }),
  computed: {
    selectedProvider: {
      get () {
        return this.$route.params.provider || ''
      },
      set (provider) {
        this.$router.push(`/providers/${provider}`)
      }
    }
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
  background: #111111;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding-top: 40px;
}
a {
  color: white;
  text-decoration: none;
}
.nuxt-link-exact-active {
  border-bottom: 2px white solid;
}
ul {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}
ul li {
  float: left;
  flex: 1 1 0%;
  padding: 10px;
  text-align: center;
}
</style>
