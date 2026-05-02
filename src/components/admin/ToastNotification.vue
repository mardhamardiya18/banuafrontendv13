<template>
  <div class="fixed top-6 right-6 z-100 flex flex-col gap-3 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-xl border text-sm font-medium min-w-[280px] max-w-[400px] animate-slide-in"
        :class="toastClasses(toast.type)"
      >
        <i :class="toastIcon(toast.type)" class="text-lg shrink-0"></i>
        <span class="flex-1">{{ toast.message }}</span>
        <button @click="dismiss(toast.id)" class="opacity-50 hover:opacity-100 transition-opacity">
          <i class="bx bx-x text-lg"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const toasts = computed(() => store.toasts)

const toastClasses = (type) => ({
  'bg-emerald-50/90 border-emerald-200 text-emerald-800': type === 'success',
  'bg-red-50/90 border-red-200 text-red-800': type === 'error',
  'bg-amber-50/90 border-amber-200 text-amber-800': type === 'warning',
  'bg-blue-50/90 border-blue-200 text-blue-800': type === 'info'
})

const toastIcon = (type) => ({
  'bx bx-check-circle text-emerald-500': type === 'success',
  'bx bx-error-circle text-red-500': type === 'error',
  'bx bx-error text-amber-500': type === 'warning',
  'bx bx-info-circle text-blue-500': type === 'info'
})

const dismiss = (id) => {
  store.toasts = store.toasts.filter(t => t.id !== id)
}
</script>

<style scoped>
@keyframes slideIn {
  from { opacity: 0; transform: translateX(80px) scale(0.9); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
.animate-slide-in {
  animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.toast-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from { opacity: 0; transform: translateX(80px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(80px) scale(0.9); }
</style>
