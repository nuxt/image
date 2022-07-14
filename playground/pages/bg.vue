<template>
  <div class="preview" />
</template>

<script lang="ts" setup>
const { generate } = useImage()

const bg = computed(() => {
  const imgUrl = generate('/images/colors.jpg', {
    width: 300,
    height: 300,
    quality: 80
  })

  return `url('${imgUrl}')`
})
</script>

<style>
.preview {
  width: 300px;
  height: 300px;
  background-image: v-bind(bg);
}
</style>
