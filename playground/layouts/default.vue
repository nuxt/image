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
  background: #111111;
  display: flex;
  flex-direction: column;
  color: #ffffff;
}
a {
  color: white;
  text-decoration: none;
}
.nuxt-link-exact-active {
  text-decoration: underline;
}
</style>
