<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">
          EdgeOne Pages
        </p>
        <h1>Image Processing Playground</h1>
        <p class="lead">
          Compare the original image with the optimized result from the Nuxt Image edgeonePages provider. The site domain is read from the <code>edgeonePages.baseURL</code> configured in <code>nuxt.config.ts</code>.
        </p>
      </div>
    </header>

    <section class="card-grid">
      <div class="card">
        <h2>Parameters</h2>
        <div class="field">
          <label>Site Domain (baseURL)</label>
          <p class="url">
            {{ baseURL || '(not configured)' }}
          </p>
        </div>
        <div class="field">
          <label>Object Path (src)</label>
          <input
            v-model="src"
            placeholder="/path/to/image.jpg"
          >
        </div>
        <div class="field split">
          <div>
            <label>Width</label>
            <input
              v-model.number="width"
              type="number"
              min="0"
            >
          </div>
          <div>
            <label>Height</label>
            <input
              v-model.number="height"
              type="number"
              min="0"
            >
          </div>
        </div>
        <div class="field split">
          <div>
            <label>fit</label>
            <select v-model="fit">
              <option value="">
                (default)
              </option>
              <option value="contain">
                contain
              </option>
              <option value="cover">
                cover
              </option>
              <option value="fill">
                fill
              </option>
            </select>
          </div>
          <div>
            <label>quality</label>
            <input
              v-model.number="quality"
              type="number"
              min="1"
              max="100"
            >
          </div>
        </div>
        <div class="field split">
          <div>
            <label>format</label>
            <select v-model="format">
              <option value="">
                (original)
              </option>
              <option value="jpeg">
                jpeg
              </option>
              <option value="png">
                png
              </option>
              <option value="webp">
                webp
              </option>
              <option value="avif">
                avif
              </option>
            </select>
          </div>
          <div>
            <label>blur</label>
            <input
              v-model.number="blur"
              type="number"
              min="0"
              max="50"
            >
          </div>
        </div>
        <div class="field split">
          <div>
            <label>rotate (deg)</label>
            <input
              v-model.number="rotate"
              type="number"
              min="0"
              max="360"
            >
          </div>
          <div>
            <label>sharpen</label>
            <input
              v-model.number="sharpen"
              type="number"
              min="0"
            >
          </div>
        </div>
        <div class="field split">
          <div>
            <label>
              <input
                v-model="strip"
                type="checkbox"
              > strip (remove EXIF)
            </label>
          </div>
          <div>
            <label>
              <input
                v-model="autoOrient"
                type="checkbox"
              > autoOrient
            </label>
          </div>
          <div>
            <label>
              <input
                v-model="interlace"
                type="checkbox"
              > interlace
            </label>
          </div>
        </div>
        <button
          class="primary"
          @click="refreshKey++"
        >
          Refresh Preview
        </button>
        <p class="hint">
          Make sure baseURL + src is publicly accessible (public read or behind CDN).
        </p>
      </div>

      <div class="card">
        <h2>Optimized (NuxtImg)</h2>
        <NuxtImg
          v-if="baseURL && src"
          :key="refreshKey + '-optimized'"
          provider="edgeonePages"
          :src="src"
          :width="width || undefined"
          :height="height || undefined"
          :format="format || undefined"
          :modifiers="computedModifiers"
          :alt="`Optimized ${src}`"
          loading="lazy"
          class="preview"
        />
        <p
          v-if="optimizedUrl"
          class="url"
        >
          {{ optimizedUrl }}
        </p>
      </div>

      <div class="card">
        <h2>Original (img)</h2>
        <img
          v-if="baseURL && src"
          :key="refreshKey + '-raw'"
          :src="rawUrl"
          :alt="`Raw ${src}`"
          class="preview"
          loading="lazy"
        >
        <p
          v-if="rawUrl"
          class="url"
        >
          {{ rawUrl }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { joinURL } from 'ufo'
import { useImage, useRuntimeConfig } from '#imports'

const $img = useImage()
const runtimeConfig = useRuntimeConfig()

const providerConfig = (runtimeConfig.public.image as { providers?: Record<string, { baseURL?: string }> } | undefined)?.providers?.edgeonePages
const baseURL = providerConfig?.baseURL ?? ''
const src = ref('/ssg-img.png')
const width = ref<number | null>(800)
const height = ref<number | null>(500)
const fit = ref<'cover' | 'contain' | 'fill' | ''>('contain')
const quality = ref<number | null>(80)
const format = ref<'jpeg' | 'png' | 'webp' | 'avif' | ''>('webp')
const blur = ref<number | null>(null)
const rotate = ref<number | null>(null)
const sharpen = ref<number | null>(null)
const strip = ref(false)
const autoOrient = ref(false)
const interlace = ref(false)
const refreshKey = ref(0)

const computedModifiers = computed(() => {
  const mods: Record<string, any> = {}
  if (fit.value) mods.fit = fit.value
  if (quality.value) mods.quality = quality.value
  if (blur.value) mods.blur = blur.value
  if (rotate.value) mods.rotate = rotate.value
  if (sharpen.value) mods.sharpen = sharpen.value
  if (strip.value) mods.strip = true
  if (autoOrient.value) mods.autoOrient = true
  if (interlace.value) mods.interlace = true
  return mods
})

const rawUrl = computed(() => baseURL && src.value ? joinURL(baseURL, src.value) : '')
const optimizedUrl = computed(() => {
  if (!baseURL || !src.value) return ''
  return $img(src.value, {
    ...computedModifiers.value,
    width: width.value || undefined,
    height: height.value || undefined,
    format: format.value || undefined,
  }, { provider: 'edgeonePages' as 'ipx' })
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.5rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #0f172a;
}
.hero {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.eyebrow {
  font-size: 0.9rem;
  color: #16a34a;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.lead {
  color: #475569;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1rem 1.25rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.field.split {
  flex-direction: row;
  gap: 0.75rem;
}
.field.split > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
label {
  font-size: 0.9rem;
  color: #475569;
}
input, select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
  font-size: 0.95rem;
}
input[type="checkbox"] {
  width: auto;
  margin-right: 0.3rem;
}
button.primary {
  align-self: flex-start;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.55rem 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
}
button.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(22, 163, 74, 0.2);
}
.hint {
  font-size: 0.85rem;
  color: #64748b;
}
.preview {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  object-fit: contain;
  max-height: 360px;
}
.url {
  word-break: break-all;
  font-size: 0.85rem;
  color: #475569;
}
</style>
