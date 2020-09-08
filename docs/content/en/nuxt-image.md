---
title: Props
description: ''
position: 4
category: Guide
---

# `src`

Path to image file. `src` sould be in form of absolute path and starts with `/`.

```vue
<template>
    <nuxt-image :src="src" ... />
</template>
```

## `sets`

```vue
<template>
    <!-- set prop of type array -->
    <nuxt-image :sets="sets" ... />
    <!-- simple string type but same functionality -->
    <nuxt-image sets="300,300:600,600:900" ... />
    <!--               |   |   |   |   | -->
    <!--------- width -^   |   |   |   | -->
    <!--                   |   |   |   | -->
    <!------- breakpoint --^   |   |   | -->
    <!---------------- width --^   |   | -->
    <!--                           |   | -->
    <!--------------- breakpoint --^   | -->
    <!------------------------ width --^ -->
</template>

<script>
export default {
    data() {
        return {
            sets: [
                {
                    width: 300
                },
                {
                    breakpoint: 300,
                    width: 600
                },
                {
                    breakpoint: 600,
                    width: 900
                }
            ]
        }
    }
}
</script>
```