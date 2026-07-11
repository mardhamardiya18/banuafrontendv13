<template>
  <div v-if="shouldShow" class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center select-none" style="pointer-events: all;">
    <!-- Prevent interaction with background by making this div take full pointer events and cover the screen -->
    
    <div class="max-w-md w-full bg-red-50 rounded-2xl p-8 border border-red-100 shadow-2xl relative overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-red-500 opacity-10 blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-red-500 opacity-10 blur-2xl"></div>
      
      <div class="relative z-10 flex flex-col items-center">
        <!-- Icon / Logo -->
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-200 overflow-hidden p-2">
          <img :src="logo" alt="Logo DMI Catering" class="w-full h-full object-contain" />
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Mohon Maaf 🙏</h1>
        <h2 class="text-xl font-semibold text-red-600 mb-4">Toko Sedang Tutup</h2>
        
        <p class="text-gray-600 mb-6 leading-relaxed">
          Saat ini kami sedang tidak menerima pesanan baru (Closed Order). 
          Silakan kembali lagi nanti untuk melakukan pemesanan.
        </p>
        
        <div class="bg-white px-4 py-3 rounded-lg border border-gray-100 w-full">
          <p class="text-sm text-gray-500 font-medium">Terima kasih atas pengertiannya 🥺</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '../../stores/settings'
import logo from '../../assets/images/logo-small.webp'

const route = useRoute()
const settingsStore = useSettingsStore()

const shouldShow = computed(() => {
  // Check if store is closed in settings
  if (!settingsStore.isStoreClosed) return false
  
  // Do not show on Admin or Auth (Login) pages
  const isAdminOrAuth = route.path.startsWith('/admin') || route.path.startsWith('/login')
  
  // Show only in user area (not admin, not auth)
  return !isAdminOrAuth
})

// Block scrolling when popup is shown
watchEffect(() => {
  if (shouldShow.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
