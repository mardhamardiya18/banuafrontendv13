<template>
  <div class="flex items-center gap-3 px-6 mt-4">
    <div class="flex-1 relative flex items-center">
      <i class="bx bx-search absolute left-4 text-xl text-brand-forest-dark/40"></i>
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="Search food..." 
        class="w-full pl-12 pr-4 py-3.5 bg-white rounded-[1.25rem] text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all"
      />
    </div>
    <button class="w-12 h-12 rounded-xl bg-brand-terracotta text-white flex items-center justify-center shrink-0 shadow-sm hover:bg-brand-maroon transition-colors active:scale-95">
      <i class="bx bx-slider-alt text-xl"></i>
    </button>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
