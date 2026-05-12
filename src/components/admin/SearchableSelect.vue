<template>
  <div class="relative searchable-select" ref="selectRef">
    <!-- Trigger -->
    <div 
      @click="toggleDropdown"
      class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-brand-maroon shadow-sm cursor-pointer flex items-center justify-between transition-all"
      :class="{ 'border-brand-maroon ring-4 ring-brand-maroon/10': isOpen }"
    >
      <span class="truncate pr-2" :class="{ 'text-gray-400': !selectedOption }">
        {{ selectedOption ? selectedOption.name : placeholder }}
      </span>
      <i class="bx bx-chevron-down text-lg transition-transform duration-300" :class="{ 'rotate-180': isOpen }"></i>
    </div>

    <!-- Dropdown -->
    <div 
      v-if="isOpen" 
      class="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden dropdown-animation"
    >
      <!-- Search Input inside Dropdown -->
      <div class="p-3 border-b border-gray-50 bg-gray-50/50">
        <div class="relative">
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            ref="searchInput"
            v-model="searchQuery" 
            type="text" 
            placeholder="Ketik untuk mencari..." 
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-brand-maroon transition-all"
            @click.stop
          />
        </div>
      </div>

      <!-- Options List -->
      <div class="max-h-60 overflow-y-auto custom-scrollbar">
        <div 
          v-for="option in filteredOptions" 
          :key="option.id"
          @click="selectOption(option)"
          class="px-4 py-3 text-sm hover:bg-brand-maroon/5 cursor-pointer transition-colors flex items-center justify-between group"
          :class="{ 'bg-brand-maroon/5 text-brand-maroon font-bold': modelValue === option.id }"
        >
          <span class="truncate">{{ option.name }}</span>
          <i v-if="modelValue === option.id" class="bx bx-check text-lg"></i>
        </div>
        <div v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-xs text-gray-400">
          <i class="bx bx-info-circle text-lg mb-1 block"></i>
          Data tidak ditemukan
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Pilih'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref(null)
const searchInput = ref(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.id === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(opt => opt.name.toLowerCase().includes(q))
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    setTimeout(() => searchInput.value?.focus(), 100)
  }
}

const selectOption = (option) => {
  emit('update:modelValue', option.id)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }

.dropdown-animation {
  animation: dropdownIn 0.2s ease-out;
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
