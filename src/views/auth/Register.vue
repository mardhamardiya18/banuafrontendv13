<template>
  <div class="min-h-screen bg-brand-cream-light flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Ornaments -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-maroon/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-terracotta/10 rounded-full blur-3xl"></div>

    <div class="w-full max-w-[500px] animate-fade-up">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
          <i class="bx bx-user-plus text-3xl text-brand-maroon"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Buat Akun Baru</h1>
        <p class="text-gray-500 mt-2">Daftar untuk mulai mengelola katering Anda</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
          <i class="bx bx-error-circle text-xl text-red-500 mt-0.5"></i>
          <div>
            <p class="text-sm font-bold text-red-800">Registrasi Gagal</p>
            <p class="text-xs text-red-600 mt-0.5">{{ errorMessage }}</p>
          </div>
          <button @click="errorMessage = ''" class="ml-auto text-red-400 hover:text-red-600">
            <i class="bx bx-x text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <div class="relative">
              <i class="bx bx-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Masukkan nama lengkap"
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-maroon/30 focus:ring-4 focus:ring-brand-maroon/5 outline-none transition-all placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div class="relative">
              <i class="bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              <input 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="nama@email.com"
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-maroon/30 focus:ring-4 focus:ring-brand-maroon/5 outline-none transition-all placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div class="relative">
                <i class="bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input 
                  v-model="form.password" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-maroon/30 focus:ring-4 focus:ring-brand-maroon/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>
            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Konfirmasi</label>
              <div class="relative">
                <i class="bx bx-check-shield absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input 
                  v-model="form.password_confirmation" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-maroon/30 focus:ring-4 focus:ring-brand-maroon/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2 pt-2">
            <input type="checkbox" id="terms" required class="w-4 h-4 rounded border-gray-300 text-brand-maroon mt-0.5" />
            <label for="terms" class="text-sm text-gray-500 leading-tight">
              Saya menyetujui <a href="#" class="text-brand-maroon font-bold hover:underline">Syarat & Ketentuan</a> serta <a href="#" class="text-brand-maroon font-bold hover:underline">Kebijakan Privasi</a>.
            </label>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-maroon/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            <i v-if="loading" class="bx bx-loader-alt bx-spin text-xl"></i>
            <span>{{ loading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center border-t border-gray-50 pt-6">
          <p class="text-sm text-gray-500">
            Sudah memiliki akun? 
            <router-link :to="{ name: 'Login' }" class="text-brand-maroon font-bold hover:underline transition-all">Masuk di sini</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (form.password !== form.password_confirmation) {
    errorMessage.value = "Konfirmasi password tidak cocok!"
    return
  }

  loading.value = true
  try {
    await auth.register(form)
    alert("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.")
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Register error:', error)
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
