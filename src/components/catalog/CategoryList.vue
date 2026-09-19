<template>
  <div class="min-w-0 max-w-full px-0 mt-4 overflow-x-auto overscroll-x-contain custom-scrollbar pb-4" ref="scrollContainer">
    <div class="flex items-center gap-2 px-6 w-max">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :ref="el => { if (el) categoryRefs[cat.id] = el; else delete categoryRefs[cat.id] }"
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

// Scroll only the category strip. scrollIntoView also scrolls ancestor containers.
watch([() => props.modelValue, () => props.categories], async ([newVal]) => {
  await nextTick()
  const container = scrollContainer.value
  const el = categoryRefs.value[newVal]
  if (!container || !el) return

  const viewport = container.getBoundingClientRect()
  const tab = el.getBoundingClientRect()
  if (tab.left >= viewport.left && tab.right <= viewport.right) return

  const target = container.scrollLeft + tab.left - viewport.left
    - (container.clientWidth - tab.width) / 2
  container.scrollTo({
    left: Math.max(0, Math.min(target, container.scrollWidth - container.clientWidth)),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  })
}, { immediate: true })

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
