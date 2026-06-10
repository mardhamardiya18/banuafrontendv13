<template>
  <teleport to="body">
    <transition name="confirm-backdrop">
      <div v-if="modelValue" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="cancel">
        <div class="absolute inset-0 backdrop-blur-sm" style="background: rgba(0,0,0,0.65);"></div>
        <transition name="confirm-content">
          <div v-if="modelValue"
               class="relative w-full max-w-sm p-7 text-center rounded-2xl"
               style="
                 background: #141420;
                 border: 1px solid rgba(255,255,255,0.08);
                 box-shadow: 0 30px 80px rgba(0,0,0,0.6);
               ">
            <!-- Top accent -->
            <div class="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                 :style="`background: linear-gradient(90deg, transparent, ${accentColor}50, transparent);`"></div>

            <!-- Icon -->
            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                 :style="`background: ${accentColor}15; border: 1px solid ${accentColor}25;`">
              <component :is="iconComponent" :size="30" :style="`color: ${accentColor};`" />
            </div>

            <h3 class="text-lg font-bold mb-2" style="color: rgba(224,224,239,0.95);">{{ title }}</h3>
            <p class="text-sm mb-7 leading-relaxed" style="color: rgba(160,160,192,0.6);">{{ message }}</p>

            <div class="flex items-center gap-3">
              <button
                @click="cancel"
                class="flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(160,160,192,0.7);"
                onmouseenter="this.style.background='rgba(255,255,255,0.07)'; this.style.color='rgba(224,224,239,0.9)'"
                onmouseleave="this.style.background='rgba(255,255,255,0.04)'; this.style.color='rgba(160,160,192,0.7)'"
              >
                {{ cancelText }}
              </button>
              <button
                @click="confirm"
                :disabled="loading"
                class="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                :style="`background: ${accentColor}; box-shadow: 0 4px 15px ${accentColor}40;`"
              >
                <Loader2 v-if="loading" :size="15" class="animate-spin-slow" />
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
import { Trash2, AlertTriangle, Info, Loader2 } from '@lucide/vue'

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

const accentColor = computed(() => ({
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#8b5cf6'
}[props.variant]))

const iconComponent = computed(() => ({
  danger: Trash2,
  warning: AlertTriangle,
  info: Info
}[props.variant]))

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

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin 1s linear infinite; }
</style>
