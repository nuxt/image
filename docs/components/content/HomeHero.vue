<template>
  <main class="mx-auto max-w-full lg:max-w-8xl">
    <!-- Hero card -->
    <div class="relative sm:overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 hero-bg-wrapper">
        <div class="absolute inset-0 mix-blend-multiply" />
      </div>

      <!-- Content -->
      <div class="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
        <h1
          class="
            text-center text-4xl
            font-extrabold
            tracking-tight
            sm:text-5xl
            lg:text-6xl
            dark:text-white
          "
        >
          <span class="block">Optimized images</span>
          <span class="block text-primary-green">for Nuxt</span>
        </h1>

        <p
          class="
            mt-6
            max-w-lg
            mx-auto
            text-center text-xl
            sm:max-w-3xl
            dark:text-white
          "
        >
          Plug-and-play image optimization for Nuxt apps. Resize and transform
          your images in your code using built-in optimizer or your favorite
          images CDN.
        </p>

        <div
          class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center"
        >
          <div
            class="
              space-y-4
              sm:space-y-0
              sm:mx-auto
              sm:inline-grid
              sm:grid-cols-2
              sm:gap-5
            "
          >
            <nuxt-link
              to="/getting-started/installation"
              class="
                flex
                items-center
                justify-center
                px-4
                py-3
                transition
                duration-300
                hover:bg-primary-600
                ring-white focus:ring-2 ring-offset-2 ring-offset-primary-800
                border border-transparent
                text-base
                font-medium
                rounded-md
                shadow-sm
                bg-primary-500
                sm:px-8
                text-white
              "
            >
              Get started
            </nuxt-link>

            <a
              href="https://githubbox.com/nuxt/image/tree/main/example"
              target="_blank"
              rel="noopener"
              class="
                flex
                items-center
                justify-center
                font-medium
                px-4
                py-3
                transition
                duration-300
                sm:px-8
                rounded
                ring-white hover:ring-2
                border-outline-1
                outline outline-1
                dark:text-white
              "
            >
              Play online
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
