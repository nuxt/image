<script setup lang="ts">
const props = defineProps<{
  source: string
}>()

const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(props.source)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <UInput
    :model-value="props.source"
    aria-label="Copy code to get started"
    size="xl"
    class="w-88"
    disabled
    :ui="{ base: 'disabled:cursor-default' }"
  >
    <template #leading>
      <UIcon name="i-ph-terminal" />
    </template>
    <template
      v-if="props.source?.length"
      #trailing
    >
      <UTooltip
        text="Copy to clipboard"
        :content="{ side: 'right' }"
      >
        <UButton
          :color="copied ? 'success' : 'neutral'"
          variant="link"
          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          aria-label="Copy to clipboard"
          @click="copy"
        />
      </UTooltip>
    </template>
  </UInput>
</template>
