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
  // Ambil BASE URL Backend dari env atau default
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  
  // Hilangkan '/api' jika ada di akhir (karena rute verify di luar prefix api admin, 
  // tapi rute publik invoice kita di api.php tetap butuh /api jika di localhost)
  // Di api.php kita rutenya: Route::get('/invoice/verify/{identifier}', ...)
  
  const backendUrl = apiUrl.replace(/\/api$/, '')
  
  // Redirect ke halaman verifikasi backend (Blade View)
  window.location.href = `${backendUrl}/api/invoice/verify/${identifier}`
})
</script>
