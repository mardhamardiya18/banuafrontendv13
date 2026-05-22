<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-maroon-500 border-t-transparent mb-4"></div>
      <h2 class="text-xl font-semibold text-slate-800 mb-2">Memverifikasi Invoice...</h2>
      <p class="text-slate-500">Anda akan diarahkan ke halaman invoice resmi DMI Catering.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  const identifier = route.params.identifier
  const apiUrl = import.meta.env.VITE_API_URL
  
  // Redirect to backend verification (Blade View)
  // Logic: https://api.banuatumpeng.com/api/invoice/verify/{identifier}
  window.location.href = `${apiUrl}/invoice/verify/${identifier}`
})
</script>
