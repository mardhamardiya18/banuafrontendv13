<template>
  <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium min-w-[280px] max-w-[400px]"
        :style="toastStyle(toast.type)"
      >
        <component :is="toastIcon(toast.type)" :size="18" class="shrink-0" :style="toastIconStyle(toast.type)" />
        <span class="flex-1" style="color: rgba(224,224,239,0.9);">{{ toast.message }}</span>
        <button
          @click="dismiss(toast.id)"
          class="transition-opacity"
          style="opacity: 0.4; color: rgba(224,224,239,0.9);"
          onmouseenter="this.style.opacity='1'"
          onmouseleave="this.style.opacity='0.4'"
        >
          <X :size="16" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from '@lucide/vue'

const store = useAdminStore()
const toasts = computed(() => store.toasts)

const toastStyle = (type) => {
  const map = {
    success: 'background: rgba(20,40,30,0.95); border: 1px solid rgba(52,211,153,0.25); box-shadow: 0 10px 40px rgba(0,0,0,0.5);',
    error: 'background: rgba(35,15,15,0.95); border: 1px solid rgba(248,113,113,0.25); box-shadow: 0 10px 40px rgba(0,0,0,0.5);',
    warning: 'background: rgba(35,30,10,0.95); border: 1px solid rgba(251,191,36,0.25); box-shadow: 0 10px 40px rgba(0,0,0,0.5);',
    info: 'background: rgba(15,20,40,0.95); border: 1px solid rgba(96,165,250,0.25); box-shadow: 0 10px 40px rgba(0,0,0,0.5);'
  }
  return `backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); ${map[type] || map.info}`
}

const toastIcon = (type) => {
  const map = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
  return map[type] || Info
}

const toastIconStyle = (type) => {
  const map = {
    success: 'color: #34d399;',
    error: 'color: #f87171;',
    warning: 'color: #fbbf24;',
    info: 'color: #60a5fa;'
  }
  return map[type] || map.info
}

const dismiss = (id) => {
  store.toasts = store.toasts.filter(t => t.id !== id)
}
</script>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from { opacity: 0; transform: translateX(80px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(80px) scale(0.9); }
</style>
