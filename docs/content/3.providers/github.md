---
title: GitHub
description: Nuxt Image for easy GitHub avatars.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/github.ts
    size: xs
---

Easily use GitHub avatars in your Nuxt app. 


Just pass the username as the `src` prop and set the width and height. Since GitHub avatars must always be square, the largest dimension is used as the size.


```vue
<!-- Width and Height -->
<NuxtImg provider="github" src="nuxt" height="50" width="50" />

<!-- Width only -->
<NuxtImg provider="github" src="unjs" width="512" />

<!-- Default size -->
<NuxtImg provider="github" src="npm"/>
```

