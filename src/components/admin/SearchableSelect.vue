<template>
  <div class="relative searchable-select" ref="selectRef">
    <!-- Trigger -->
    <div
      @click="toggleDropdown"
      class="w-full px-4 py-3 rounded-xl text-sm cursor-pointer flex items-center justify-between transition-all duration-200"
      :style="isOpen
        ? 'background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.45); box-shadow: 0 0 0 3px rgba(139,92,246,0.08); color: rgba(224,224,239,0.95);'
        : 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); color: rgba(224,224,239,0.9);'"
    >
      <span class="truncate pr-2"
            :style="!selectedOption ? 'color: rgba(160,160,192,0.45);' : ''">
        {{ selectedOption ? selectedOption.name : placeholder }}
      </span>
      <i class="bx bx-chevron-down text-lg transition-transform duration-300"
         :style="{ transform: isOpen ? 'rotate(180deg)' : '', color: 'rgba(160,160,192,0.5)' }"></i>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-200 mt-1.5 w-full rounded-xl overflow-hidden dropdown-animation"
      style="
        background: #1a1a2e;
        border: 1px solid rgba(255,255,255,0.09);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      "
    >
      <!-- Search Input -->
      <div class="p-2.5" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <div class="relative">
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm"
             style="color: rgba(160,160,192,0.4);"></i>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Ketik untuk mencari..."
            class="w-full pl-8 pr-4 py-2 rounded-lg text-xs outline-none transition-all duration-200"
            style="
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.07);
              color: rgba(224,224,239,0.9);
            "
            @click.stop
            @focus="e => { e.target.style.borderColor='rgba(139,92,246,0.4)'; e.target.style.background='rgba(139,92,246,0.05)'; }"
            @blur="e => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.background='rgba(255,255,255,0.05)'; }"
          />
        </div>
      </div>

      <!-- Options List -->
      <div class="max-h-52 overflow-y-auto dark-scrollbar">
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          @click="selectOption(option)"
          class="px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between"
          :style="modelValue === option.id
            ? 'background: rgba(139,92,246,0.15); color: #a78bfa;'
            : 'color: rgba(200,200,230,0.85);'"
          @mouseenter="e => { if (modelValue !== option.id) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }"
          @mouseleave="e => { if (modelValue !== option.id) e.currentTarget.style.background=''; }"
        >
          <span class="truncate">{{ option.name }}</span>
          <i v-if="modelValue === option.id" class="bx bx-check text-lg" style="color: #a78bfa;"></i>
        </div>
        <div v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-xs"
             style="color: rgba(160,160,192,0.45);">
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
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Pilih' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref(null)
const searchInput = ref(null)

const selectedOption = computed(() => props.options.find(opt => opt.id === props.modelValue))
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
.dark-scrollbar::-webkit-scrollbar { width: 4px; }
.dark-scrollbar::-webkit-scrollbar-track { background: transparent; }
.dark-scrollbar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
.dark-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.5); }

.dropdown-animation {
  animation: dropdownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

input::placeholder {
  color: rgba(160, 160, 192, 0.35);
}
</style>
