<template>
  <div class="overflow-hidden bg-[#f1e9df]">
    <img v-if="src && !failed" :src="src" :alt="name" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" @error="failed = true" />
    <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-maroon/50"><Utensils :size="32" aria-hidden="true" /><span class="text-[10px]">Foto segera hadir</span></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Utensils } from 'lucide-vue-next'
const props = defineProps({ src: String, name: String })
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>
