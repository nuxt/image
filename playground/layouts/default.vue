<template>
  <main>
    <ul>
      <li>
        <NuxtLink to="/">
          Home
        </NuxtLink>
        <NuxtLink to="/img">
          NuxtImg
        </NuxtLink>
        <NuxtLink to="/picture">
          NuxtPicture
        </NuxtLink>
        <NuxtLink to="/events">
          Events
        </NuxtLink>
        <NuxtLink to="/ipx-layers">
          IPX Layers
        </NuxtLink>
      </li>
      <li>
        <ProviderSelector />
      </li>
    </ul>
    <slot />
  </main>
</template>

<script>
export default {
}
</script>

<style>
/* Global styles */
body {
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
</style>

<style scoped>
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
