<template>
  <teleport to="body">
    <transition name="modal-backdrop">
      <div v-if="modelValue" class="fixed inset-0 z-[80] flex items-center justify-center p-4" @click.self="close">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
        <transition name="modal-content">
          <div
            v-if="modelValue"
            class="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full overflow-hidden"
            :class="sizeClass"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
              <button @click="close" class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <i class="bx bx-x text-2xl"></i>
              </button>
            </div>
            <!-- Body -->
            <div class="px-7 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <slot />
            </div>
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-7 py-4 border-t border-gray-100 bg-gray-50/50">
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Modal' },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg', 'xl'].includes(v) }
})

const emit = defineEmits(['update:modelValue'])

const sizeClass = computed(() => ({
  'max-w-md': props.size === 'sm',
  'max-w-lg': props.size === 'md',
  'max-w-2xl': props.size === 'lg',
  'max-w-4xl': props.size === 'xl'
}))

const close = () => emit('update:modelValue', false)
</script>

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active { transition: opacity 0.3s ease; }
.modal-backdrop-enter-from,
.modal-backdrop-leave-to { opacity: 0; }

.modal-content-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-content-leave-active { transition: all 0.2s ease-in; }
.modal-content-enter-from { opacity: 0; transform: scale(0.92) translateY(20px); }
.modal-content-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
</style>
