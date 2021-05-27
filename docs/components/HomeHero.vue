<template>
  <main>
    <!-- Hero card -->
    <div class="relative sm:rounded-2xl sm:overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0">
        <img
          class="h-full w-full object-cover"
          src="~/static/nuxt_image_hero.svg"
          alt="Nuxt Image Hero"
        />
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
          "
        >
          <span class="block text-white">Optimized images</span>
          <span class="block text-primary-green">for Nuxt</span>
        </h1>

        <p
          class="
            mt-6
            max-w-lg
            mx-auto
            text-center text-xl
            sm:max-w-3xl
            text-white
          "
        >
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat
          aliqua.
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
                border border-transparent
                text-base
                font-medium
                rounded-md
                shadow-sm
                text-white
                bg-primary-green
                sm:px-8
              "
            >
              Get started
            </nuxt-link>

            <a
              href="https://github.com/nuxt/image"
              class="
                flex
                items-center
                justify-center
                font-medium
                px-4
                py-3
                sm:px-8
                text-white
              "
            >
              Open on Github
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
