<template>
  <div class="px-0 mt-4 overflow-x-auto custom-scrollbar pb-4" ref="scrollContainer">
    <div class="flex items-center gap-2 px-6 w-max">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :ref="el => { if (el) categoryRefs[cat.id] = el }"
        @click="selectCategory(cat.id)"
        :aria-pressed="modelValue === cat.id"
        class="min-h-11 px-4 py-2 text-[13px] rounded-full transition-all duration-300 whitespace-nowrap border-2 font-bold tracking-tight active:scale-95"
        :class="modelValue === cat.id 
          ? 'bg-brand-maroon text-white border-brand-maroon shadow-lg shadow-brand-maroon/20' 
          : 'bg-white text-gray-600 border-brand-maroon/10 hover:border-brand-maroon/30'"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
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
const categoryRefs = ref({})
const scrollContainer = ref(null)

const selectCategory = (id) => {
  emit('update:modelValue', id)
}

// Auto scroll to active category
watch(() => props.modelValue, async (newVal) => {
  await nextTick()
  const el = categoryRefs.value[newVal]
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
  }
}, { immediate: true })

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; scroll-behavior: smooth; }
</style>
