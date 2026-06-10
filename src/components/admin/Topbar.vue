<template>
  <header
    class="sticky top-0 z-30 h-[72px] flex items-center justify-between px-6 gap-4 transition-all duration-300"
    style="
      background: rgba(10, 10, 15, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    "
  >
    <!-- Left: Mobile toggle + Search -->
    <div class="flex items-center gap-4 flex-1">
      <button
        @click="store.toggleMobileSidebar()"
        class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
        style="color: rgba(160,160,192,0.7);"
        onmouseenter="this.style.background='rgba(255,255,255,0.06)'"
        onmouseleave="this.style.background=''"
      >
        <Menu :size="22" />
      </button>

      <!-- Search -->
      <div
        class="hidden sm:flex items-center gap-3 rounded-xl px-4 py-2.5 w-full max-w-md transition-all duration-200"
        style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);"
        @mouseenter="e => e.currentTarget.style.borderColor='rgba(139,92,246,0.3)'"
        @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'"
      >
        <Search :size="16" style="color: rgba(160,160,192,0.5);" class="shrink-0" />
        <input
          type="text"
          placeholder="Cari menu, produk, order..."
          class="bg-transparent text-sm outline-none w-full placeholder-shown:text-opacity-50"
          style="color: rgba(224,224,239,0.9);"
        />
        <kbd class="hidden md:inline text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0"
             style="color: rgba(160,160,192,0.4); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);">⌘K</kbd>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-1.5">
      <!-- Notifications -->
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
        style="color: rgba(160,160,192,0.7);"
        onmouseenter="this.style.background='rgba(255,255,255,0.06)'; this.style.color='rgba(224,224,239,0.9)'"
        onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.7)'"
      >
        <Bell :size="20" />
        <span class="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-[#0a0a0f]"
              style="background: #E07A5F;"></span>
      </button>

      <!-- Settings -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
        style="color: rgba(160,160,192,0.7);"
        onmouseenter="this.style.background='rgba(255,255,255,0.06)'; this.style.color='rgba(224,224,239,0.9)'"
        onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.7)'"
      >
        <Settings :size="20" />
      </button>

      <!-- Divider -->
      <div class="w-px h-7 mx-1" style="background: rgba(255,255,255,0.07);"></div>

      <!-- User dropdown -->
      <div class="relative" ref="userDropdownRef">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl transition-all duration-200"
          style="color: rgba(224,224,239,0.9);"
          onmouseenter="this.style.background='rgba(255,255,255,0.05)'"
          onmouseleave="this.style.background=''"
        >
          <!-- Avatar -->
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style="background: linear-gradient(135deg, #690B22, #a01535);"
          >
            {{ userInitial }}
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-sm font-semibold leading-tight" style="color: rgba(224,224,239,0.95);">{{ userName }}</p>
            <p class="text-[11px]" style="color: rgba(139,92,246,0.8);">{{ userRole }}</p>
          </div>
          <ChevronDown :size="14" class="hidden sm:block transition-transform duration-200"
                       :style="{ transform: showUserMenu ? 'rotate(180deg)' : '', color: 'rgba(160,160,192,0.5)' }" />
        </button>

        <!-- Dropdown -->
        <transition name="dropdown">
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-52 rounded-2xl py-2 overflow-hidden"
            style="
              background: #141420;
              border: 1px solid rgba(255,255,255,0.08);
              box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            "
          >
            <!-- User info header -->
            <div class="px-4 py-3 mb-1" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <p class="text-sm font-semibold" style="color: rgba(224,224,239,0.95);">{{ userName }}</p>
              <p class="text-xs mt-0.5" style="color: rgba(160,160,192,0.5);">admin@banuacatering.id</p>
            </div>

            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style="color: rgba(160,160,192,0.8);"
                    onmouseenter="this.style.background='rgba(255,255,255,0.04)'; this.style.color='rgba(224,224,239,0.95)'"
                    onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.8)'">
              <User :size="16" style="color: rgba(139,92,246,0.7);" />
              Profil Saya
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style="color: rgba(160,160,192,0.8);"
                    onmouseenter="this.style.background='rgba(255,255,255,0.04)'; this.style.color='rgba(224,224,239,0.95)'"
                    onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.8)'">
              <Settings :size="16" style="color: rgba(139,92,246,0.7);" />
              Pengaturan
            </button>

            <div class="my-1 mx-2 h-px" style="background: rgba(255,255,255,0.05);"></div>

            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style="color: rgba(224, 100, 100, 0.8);"
              onmouseenter="this.style.background='rgba(224,100,100,0.08)'; this.style.color='rgba(224,100,100,1)'"
              onmouseleave="this.style.background=''; this.style.color='rgba(224,100,100,0.8)'"
            >
              <LogOut :size="16" />
              Keluar
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import { Menu, Search, Bell, Settings, ChevronDown, User, LogOut } from '@lucide/vue'

const store = useAdminStore()
const auth = useAuthStore()
const showUserMenu = ref(false)
const userDropdownRef = ref(null)

const userName = ref('Admin')
const userRole = ref('Administrator')
const userInitial = ref('A')

const handleLogout = () => {
  showUserMenu.value = false
  window.location.href = '/login'
}

const handleClickOutside = (e) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(e.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.95); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }

input::placeholder {
  color: rgba(160, 160, 192, 0.4);
}
</style>
