<template>
  <main class="d-container">
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
          Plug-and-play image optimization for Nuxt apps.
          Resize and transform your images in your code using built-in optimizer or your favorite images CDN.
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
                text-white
                bg-primary-500
                sm:px-8
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
                text-white
                rounded
                ring-white hover:ring-2
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
  .hero-bg-wrapper {
    background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1256 586' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(%23clip0)' filter='url(%23filter0_dd)'><path fill='url(%23paint0_linear)' d='M20 0h1216v546H20z'/><path fill='url(%23paint1_linear)' d='M20 0h1216v546H20z'/><path d='M220.65 386C72.486 386 16.706 465.33-42.352 535.572c-58.505 83.461 47.76 82.461 154.539 81.439 213.063-2.039 510.432-2.17 773.143 5.446 464.17 13.455-21.027-228.272-190.592-145.787C525.173 559.155 393.169 386 220.65 386z' fill='%233C6D6D'/><path d='M947.85 442c137.38 0 267.19 77.491 354.83 143.258 75.21 56.433 0 66.733-110.83 66.733-244 0-630.335-.874-962.574 0-545.292 1.435-20.582-171.418 185.831-131.033C643.479 565.64 810.548 442 947.85 442z' fill='%23003C3C'/></g><defs><linearGradient id='paint0_linear' x1='628' y1='0' x2='628' y2='546' gradientUnits='userSpaceOnUse'><stop stop-color='%23003C3C'/><stop offset='1' stop-color='%23002021'/></linearGradient><linearGradient id='paint1_linear' x1='628' y1='0' x2='628' y2='546' gradientUnits='userSpaceOnUse'><stop stop-color='%23003C3C'/><stop offset='1' stop-color='%23002021'/></linearGradient><clipPath id='clip0'><path fill='%23fff' transform='translate(20)' d='M0 0h1216v546H0z'/></clipPath><filter id='filter0_dd' x='0' y='0' width='1256' height='586' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/><feMorphology radius='5' in='SourceAlpha' result='effect1_dropShadow'/><feOffset dy='10'/><feGaussianBlur stdDeviation='5'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/><feBlend in2='BackgroundImageFix' result='effect1_dropShadow'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/><feMorphology radius='5' in='SourceAlpha' result='effect2_dropShadow'/><feOffset dy='20'/><feGaussianBlur stdDeviation='12.5'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/><feBlend in2='effect1_dropShadow' result='effect2_dropShadow'/><feBlend in='SourceGraphic' in2='effect2_dropShadow' result='shape'/></filter></defs></svg>");
    background-position: bottom;
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
