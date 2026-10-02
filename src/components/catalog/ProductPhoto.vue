<template>
  <div class="overflow-hidden bg-[#f1e9df]">
    <picture v-if="src && !failed" class="contents">
      <source v-if="!originalOnly && mobileImageSrcset(src)" media="(max-width: 767px)" :srcset="mobileImageSrcset(src)" :sizes="sizes" />
      <img :src="src" :alt="name" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" @error="handleImageError" />
    </picture>
    <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-maroon/50"><Utensils :size="32" aria-hidden="true" /><span class="text-[10px]">Foto segera hadir</span></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Utensils } from 'lucide-vue-next'
import { mobileImageSrcset } from '../../utils/catalogImages'
const props = defineProps({ src: String, name: String, sizes: { type: String, default: '(max-width: 767px) 50vw, 400px' } })
const failed = ref(false)
const originalOnly = ref(false)
function handleImageError() {
  if (!originalOnly.value && mobileImageSrcset(props.src)) originalOnly.value = true
  else failed.value = true
}
watch(() => props.src, () => { failed.value = false; originalOnly.value = false })
</script>
