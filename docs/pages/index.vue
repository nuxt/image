<template>
  <div>
    <div class="min-h-screen bg-white">
      <header>
        <div class="relative bg-white">
          <div class="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
            <div class="flex justify-start lg:w-0 lg:flex-1">
              <nuxt-link to="/">
                <span class="sr-only">Nuxt Image</span>
                <img class="h-8 w-auto sm:h-10" src="~/static/logo-light.svg" alt="">
              </nuxt-link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div>
          <!-- Hero card -->
          <div class="relative">
            <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div class="relative sm:rounded-2xl sm:overflow-hidden">
                <div class="absolute inset-0">
                  <img class="h-full w-full object-cover" src="~/static/nuxt_image_hero.svg" alt="Nuxt Image Hero">
                  <div class="absolute inset-0 bg-indigo-700 mix-blend-multiply"></div>
                </div>
                <div class="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                  <h1 class="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    <span class="block text-white">Optimized images</span>
                    <span class="block text-primary-green">for Nuxt</span>
                  </h1>
                  <p class="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
                  </p>
                  <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                    <div class="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                      <nuxt-link to="/getting-started/installation" class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-green hover:bg-indigo-50 sm:px-8">
                        Get started
                      </nuxt-link>
                      <a href="https://github.com/nuxt/image" class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-secondary-dark bg-white bg-opacity-60 hover:bg-opacity-70 sm:px-8">
                        Open on Github
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- More main page content here... -->
      </main>
    </div>

    <div class="bg-cloud-surface">
        <div class="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24 lg:px-8">
          <div class="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            <div>
              <div>
                <span class="flex items-center justify-center h-12 w-12 rounded-md bg-terciary bg-opacity-100">
                  <!-- Heroicon name: outline/inbox -->
                  <svg class="h-6 w-6 text-primary-green-darkest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </span>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-medium text-secondary-darkest">Resize and manipulate</h3>
                <p class="mt-2 text-base text-secondary">
                  Generate images at the right size, defined in your components or following your breakpoints. Change the format and quality of your images.
                </p>
              </div>
            </div>
      
            <div>
              <div>
                <span class="flex items-center justify-center h-12 w-12 rounded-md bg-terciary bg-opacity-100">
                  <!-- Heroicon name: outline/users -->
                  <svg class="h-6 w-6 text-primary-green-darkest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-medium text-secondary-darkest">Image providers</h3>
                <p class="mt-2 text-base text-secondary">
                  Use your favorite image providers with ease or use the built-in one. Imgix, Cloudinary, Prismic, Twicpics, Vercel and more are supported by default.
                </p>
              </div>
            </div>
      
            <div>
              <div>
                <span class="flex items-center justify-center h-12 w-12 rounded-md bg-terciary bg-opacity-100">
                  <!-- Heroicon name: outline/trash -->
                  <svg class="h-6 w-6 text-primary-green-darkest" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </span>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-medium text-secondary-darkest">Standard compliant</h3>
                <p class="mt-2 text-base text-secondary">
                  Our components generates standard &lt;img&gt; and &lt;picture&gt; tags. No tricky wrapper so you can style your images with confidence.
                </p>
              </div>
            </div>
    
          </div>
        </div>
      </div>
  </div>
</template>