<template>
  <div class="px-6 mt-8 overflow-x-auto custom-scrollbar pb-2 -mx-6">
    <div class="flex items-center gap-6 px-6 w-max">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="emit('update:modelValue', cat.id)"
        class="relative pb-2 text-[15px] transition-colors duration-300 whitespace-nowrap"
        :class="modelValue === cat.id ? 'text-brand-terracotta font-bold' : 'text-gray-400 font-medium hover:text-gray-600'"
      >
        {{ cat.name }}
        <span 
          v-if="modelValue === cat.id" 
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-brand-terracotta rounded-full"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [Number, String],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
