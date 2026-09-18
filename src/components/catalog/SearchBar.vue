<template>
  <div class="relative mx-6 mt-6">
    <Search :size="19" class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-maroon/50" aria-hidden="true" />
    <input type="search" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" aria-label="Cari menu" placeholder="Cari menu favoritmu..." class="w-full min-h-12 pl-12 pr-4 py-3 bg-white border border-brand-maroon/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50" />
  </div>
</template>
<script setup>
import { Search } from 'lucide-vue-next'
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>