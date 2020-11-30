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
    </ul>
    <Nuxt />
  </main>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  background: #111111;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
a {
  color: white;
  text-decoration: none;
}
.nuxt-link-exact-active {
  text-decoration: underline;
}
</style>
