<template>
  <teleport to="body">
    <transition name="modal-backdrop">
      <div v-if="modelValue" class="fixed inset-0 z-80 flex items-center justify-center p-4" @click.self="close">
        <div class="absolute inset-0 backdrop-blur-sm" style="background: rgba(0,0,0,0.65);"></div>
        <transition name="modal-content">
          <div
            v-if="modelValue"
            class="relative rounded-2xl w-full overflow-hidden"
            :class="sizeClass"
            style="
              background: #141420;
              border: 1px solid rgba(255,255,255,0.08);
              box-shadow: 0 30px 80px rgba(0,0,0,0.6);
            "
          >
            <!-- Top accent line -->
            <div class="absolute top-0 left-0 right-0 h-px"
                 style="background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);"></div>

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5"
                 style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <h3 class="text-base font-bold" style="color: rgba(224,224,239,0.95);">{{ title }}</h3>
              <button
                @click="close"
                class="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                style="color: rgba(160,160,192,0.5);"
                onmouseenter="this.style.background='rgba(255,255,255,0.06)'; this.style.color='rgba(224,224,239,0.8)'"
                onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.5)'"
              >
                <X :size="20" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto admin-scrollbar">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4"
                 style="border-top: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);">
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
import { X } from '@lucide/vue'

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
</style>
