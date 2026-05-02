<template>
  <div class="min-h-screen bg-brand-cream-light flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Ornaments -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-maroon/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-terracotta/10 rounded-full blur-3xl"></div>

    <div class="w-full max-w-[440px] animate-fade-up">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
          <i class="bx bxs-dish text-3xl text-brand-maroon"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h1>
        <p class="text-gray-500 mt-2">Masuk ke dashboard admin Banua Catering</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
          <i class="bx bx-error-circle text-xl text-red-500 mt-0.5"></i>
          <div>
            <p class="text-sm font-bold text-red-800">Login Gagal</p>
            <p class="text-xs text-red-600 mt-0.5">{{ errorMessage }}</p>
          </div>
          <button @click="errorMessage = ''" class="ml-auto text-red-400 hover:text-red-600">
            <i class="bx bx-x text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div class="relative">
              <i class="bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              <input 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="nama@email.com"
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-maroon/30 focus:ring-4 focus:ring-brand-maroon/5 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-gray-700">Password</label>
              <a href="#" class="text-xs font-bold text-brand-maroon hover:text-brand-terracotta transition-colors">Lupa Password?</a>
            </div>
            <div class="relative">
              <i class="bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="••••••••"
                class="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-brand-maroon/30 focus:ring-4 focus:ring-brand-maroon/5 outline-none transition-all placeholder:text-gray-400"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i class="bx" :class="showPassword ? 'bx-hide' : 'bx-show'"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="remember" class="w-4 h-4 rounded border-gray-300 text-brand-maroon focus:ring-brand-maroon/20" />
            <label for="remember" class="text-sm text-gray-500 cursor-pointer select-none">Ingat saya di perangkat ini</label>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-maroon/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            <i v-if="loading" class="bx bx-loader-alt bx-spin text-xl"></i>
            <span>{{ loading ? 'Sedang Masuk...' : 'Masuk Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            Belum punya akun? 
            <router-link :to="{ name: 'Register' }" class="text-brand-maroon font-bold hover:underline transition-all">Daftar Akun</router-link>
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="text-center mt-8 space-y-4">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Banua Catering Ecosystem</p>
        <div class="flex items-center justify-center gap-4">
          <a href="#" class="text-xs text-gray-400 hover:text-brand-maroon transition-colors">Privacy Policy</a>
          <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
          <a href="#" class="text-xs text-gray-400 hover:text-brand-maroon transition-colors">Terms of Service</a>
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
const showPassword = ref(false)
const errorMessage = ref('')
const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await auth.login(form)
    await auth.fetchUser() // Ambil data user setelah login sukses
    router.push({ name: 'AdminDashboard' })
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.message || 'Email atau password salah. Silakan coba lagi.'
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
