<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
       style="background: #0a0a0f;">
    <!-- Ambient background effects -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Top-left glow -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
           style="background: radial-gradient(circle, rgba(105,11,34,0.25) 0%, transparent 70%);"></div>
      <!-- Bottom-right glow -->
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl"
           style="background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);"></div>
      <!-- Center subtle -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
           style="background: radial-gradient(circle, rgba(20,20,50,0.5) 0%, transparent 70%);"></div>
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-[0.015]"
           style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 50px 50px;"></div>
    </div>

    <div class="w-full max-w-[420px] relative z-10" style="animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;">
      <!-- Logo / Brand Section -->
      <div class="text-center mb-8">
        <!-- Logo -->
        <div class="relative inline-flex mb-5">
          <div class="w-[80px] h-[80px] rounded-2xl flex items-center justify-center relative overflow-hidden p-1"
               style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
            <img :src="logoImg" alt="DMI Catering" class="w-full h-full object-contain" />
          </div>
          <!-- Glow ring -->
          <div class="absolute inset-0 rounded-2xl pointer-events-none"
               style="box-shadow: 0 0 30px rgba(105,11,34,0.35);"></div>
        </div>

        <h1 class="text-2xl font-bold mb-1" style="color: rgba(224,224,239,0.97);">DMI Catering</h1>
        <p class="text-xs font-semibold mb-2 uppercase tracking-widest" style="color: rgba(224,122,95,0.7);">By Dapur Mamah Iis</p>
        <p class="text-sm" style="color: rgba(160,160,192,0.55);">Masuk ke dashboard admin</p>
      </div>

      <!-- Login Card -->
      <div class="rounded-2xl p-7 sm:p-9 relative overflow-hidden"
           style="
             background: rgba(20,20,32,0.85);
             border: 1px solid rgba(255,255,255,0.07);
             backdrop-filter: blur(20px);
             -webkit-backdrop-filter: blur(20px);
             box-shadow: 0 25px 80px rgba(0,0,0,0.5);
           ">
        <!-- Top edge glow -->
        <div class="absolute top-0 left-0 right-0 h-px"
             style="background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);"></div>

        <!-- Error Alert -->
        <transition name="error-fade">
          <div v-if="errorMessage"
               class="mb-6 flex items-start gap-3 rounded-xl p-4"
               style="background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2);">
            <AlertCircle :size="18" style="color: #f87171;" class="shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="text-sm font-bold" style="color: #f87171;">Login Gagal</p>
              <p class="text-xs mt-0.5" style="color: rgba(248,113,113,0.7);">{{ errorMessage }}</p>
            </div>
            <button @click="errorMessage = ''"
                    style="color: rgba(248,113,113,0.5);"
                    onmouseenter="this.style.color='rgba(248,113,113,0.9)'"
                    onmouseleave="this.style.color='rgba(248,113,113,0.5)'">
              <X :size="16" />
            </button>
          </div>
        </transition>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-semibold mb-2" style="color: rgba(200,200,220,0.8);">Email</label>
            <div class="relative">
              <Mail :size="16"
                    class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style="color: rgba(160,160,192,0.4);" />
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="nama@email.com"
                class="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style="
                  background: rgba(255,255,255,0.04);
                  border: 1px solid rgba(255,255,255,0.07);
                  color: rgba(224,224,239,0.95);
                "
                @focus="e => { e.target.style.borderColor='rgba(139,92,246,0.5)'; e.target.style.background='rgba(139,92,246,0.05)'; }"
                @blur="e => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.background='rgba(255,255,255,0.04)'; }"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold" style="color: rgba(200,200,220,0.8);">Password</label>
              <a href="#"
                 class="text-xs font-semibold transition-colors"
                 style="color: rgba(139,92,246,0.7);"
                 onmouseenter="this.style.color='rgba(167,139,250,1)'"
                 onmouseleave="this.style.color='rgba(139,92,246,0.7)'">Lupa Password?</a>
            </div>
            <div class="relative">
              <Lock :size="16"
                    class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style="color: rgba(160,160,192,0.4);" />
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style="
                  background: rgba(255,255,255,0.04);
                  border: 1px solid rgba(255,255,255,0.07);
                  color: rgba(224,224,239,0.95);
                "
                @focus="e => { e.target.style.borderColor='rgba(139,92,246,0.5)'; e.target.style.background='rgba(139,92,246,0.05)'; }"
                @blur="e => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.background='rgba(255,255,255,0.04)'; }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style="color: rgba(160,160,192,0.4);"
                onmouseenter="this.style.color='rgba(200,200,220,0.8)'"
                onmouseleave="this.style.color='rgba(160,160,192,0.4)'"
              >
                <component :is="showPassword ? EyeOff : Eye" :size="17" />
              </button>
            </div>
          </div>

          <!-- Remember me -->
          <div class="flex items-center gap-2.5">
            <div class="relative">
              <input type="checkbox" id="remember"
                     class="sr-only peer"
                     v-model="rememberMe" />
              <div class="w-4 h-4 rounded border cursor-pointer transition-all duration-200 flex items-center justify-center"
                   :style="rememberMe
                     ? 'background: rgba(139,92,246,0.8); border-color: rgba(139,92,246,0.8);'
                     : 'background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15);'"
                   @click="rememberMe = !rememberMe">
                <Check v-if="rememberMe" :size="11" class="text-white" />
              </div>
            </div>
            <label for="remember"
                   class="text-sm cursor-pointer select-none"
                   style="color: rgba(160,160,192,0.6);"
                   @click="rememberMe = !rememberMe">
              Ingat saya di perangkat ini
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="relative w-full font-bold py-3.5 rounded-xl overflow-hidden transition-all duration-200 flex items-center justify-center gap-2.5 mt-2"
            style="
              background: linear-gradient(135deg, #690B22 0%, #8a0f2b 50%, #690B22 100%);
              background-size: 200% 100%;
              color: rgba(255,255,255,0.95);
              box-shadow: 0 4px 20px rgba(105,11,34,0.35);
            "
            :style="loading ? 'opacity: 0.75; cursor: not-allowed;' : ''"
            @mouseenter="e => { if (!loading) { e.currentTarget.style.boxShadow='0 8px 30px rgba(105,11,34,0.5)'; e.currentTarget.style.transform='translateY(-1px)'; }}"
            @mouseleave="e => { e.currentTarget.style.boxShadow='0 4px 20px rgba(105,11,34,0.35)'; e.currentTarget.style.transform=''; }"
            @mousedown="e => { if (!loading) e.currentTarget.style.transform='scale(0.98)'; }"
            @mouseup="e => { e.currentTarget.style.transform=''; }"
          >
            <!-- Shimmer effect -->
            <div class="absolute inset-0 animate-shimmer pointer-events-none"></div>
            <Loader2 v-if="loading" :size="18" class="animate-spin-slow" />
            <LogIn v-else :size="18" />
            <span>{{ loading ? 'Sedang Masuk...' : 'Masuk Sekarang' }}</span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 space-y-3">
        <p class="text-[11px] font-bold uppercase tracking-[0.2em]"
           style="color: rgba(160,160,192,0.25);">Banua Catering Ecosystem</p>
        <div class="flex items-center justify-center gap-4">
          <a href="#" class="text-xs transition-colors"
             style="color: rgba(160,160,192,0.3);"
             onmouseenter="this.style.color='rgba(167,139,250,0.7)'"
             onmouseleave="this.style.color='rgba(160,160,192,0.3)'">Privacy Policy</a>
          <span class="w-1 h-1 rounded-full" style="background: rgba(160,160,192,0.2);"></span>
          <a href="#" class="text-xs transition-colors"
             style="color: rgba(160,160,192,0.3);"
             onmouseenter="this.style.color='rgba(167,139,250,0.7)'"
             onmouseleave="this.style.color='rgba(160,160,192,0.3)'">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import {
  Mail, Lock, Eye, EyeOff,
  AlertCircle, X, Check, Loader2, LogIn
} from '@lucide/vue'
import logoImg from '../../assets/images/logo-small.webp'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')
const form = reactive({ email: '', password: '' })

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await auth.login(form)
    await auth.fetchUser()
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
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-fade-enter-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.error-fade-leave-active { transition: all 0.2s ease; }
.error-fade-enter-from { opacity: 0; transform: translateY(-8px); }
.error-fade-leave-to { opacity: 0; transform: translateY(-4px); }

input::placeholder {
  color: rgba(160, 160, 192, 0.35);
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.animate-pulse-glow {
  animation: pulse-glow 2.5s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spin 1s linear infinite; }
</style>
