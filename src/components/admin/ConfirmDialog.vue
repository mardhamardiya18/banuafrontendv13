<template>
  <teleport to="body">
    <transition name="confirm-backdrop">
      <div v-if="modelValue" class="fixed inset-0 z-90 flex items-center justify-center p-4" @click.self="cancel">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
        <transition name="confirm-content">
          <div v-if="modelValue" class="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-sm p-7 text-center">
            <!-- Icon -->
            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                 :class="iconBg">
              <i :class="[iconClass, 'text-3xl']" :style="{ color: iconColor }"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 mb-7 leading-relaxed">{{ message }}</p>
            <div class="flex items-center gap-3">
              <button
                @click="cancel"
                class="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="confirm"
                :disabled="loading"
                class="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                :class="confirmBtnClass"
              >
                <i v-if="loading" class="bx bx-loader-alt bx-spin mr-1"></i>
                {{ confirmText }}
              </button>
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
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah Anda yakin?' },
  variant: { type: String, default: 'danger', validator: v => ['danger', 'warning', 'info'].includes(v) },
  confirmText: { type: String, default: 'Hapus' },
  cancelText: { type: String, default: 'Batal' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const iconBg = computed(() => ({
  'bg-red-50': props.variant === 'danger',
  'bg-amber-50': props.variant === 'warning',
  'bg-blue-50': props.variant === 'info'
}))
const iconClass = computed(() => ({
  'bx bx-trash': props.variant === 'danger',
  'bx bx-error': props.variant === 'warning',
  'bx bx-info-circle': props.variant === 'info'
}))
const iconColor = computed(() => ({
  danger: '#ef4444', warning: '#f59e0b', info: '#3b82f6'
}[props.variant]))
const confirmBtnClass = computed(() => ({
  'bg-red-500 hover:bg-red-600': props.variant === 'danger',
  'bg-amber-500 hover:bg-amber-600': props.variant === 'warning',
  'bg-blue-500 hover:bg-blue-600': props.variant === 'info'
}))

const cancel = () => emit('update:modelValue', false)
const confirm = () => emit('confirm')
</script>

<style scoped>
.confirm-backdrop-enter-active,
.confirm-backdrop-leave-active { transition: opacity 0.3s ease; }
.confirm-backdrop-enter-from,
.confirm-backdrop-leave-to { opacity: 0; }
.confirm-content-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.confirm-content-leave-active { transition: all 0.2s ease-in; }
.confirm-content-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.confirm-content-leave-to { opacity: 0; transform: scale(0.95); }
</style>
