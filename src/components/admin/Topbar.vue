<template>
  <header
    class="sticky top-0 z-30 h-[72px] bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 gap-4"
  >
    <!-- Left: Mobile toggle + Search -->
    <div class="flex items-center gap-4 flex-1">
      <button
        @click="store.toggleMobileSidebar()"
        class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <i class="bx bx-menu text-2xl"></i>
      </button>

      <!-- Search -->
      <div class="hidden sm:flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 w-full max-w-md border border-transparent focus-within:border-brand-maroon/20 focus-within:bg-white transition-all">
        <i class="bx bx-search text-gray-400 text-lg"></i>
        <input
          type="text"
          placeholder="Cari menu, produk, order..."
          class="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
        <kbd class="hidden md:inline text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <!-- Notifications -->
      <button class="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
        <i class="bx bx-bell text-xl"></i>
        <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-terracotta rounded-full border-2 border-white"></span>
      </button>

      <!-- Settings -->
      <button class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
        <i class="bx bx-cog text-xl"></i>
      </button>

      <!-- Divider -->
      <div class="w-px h-8 bg-gray-200 mx-1"></div>

      <!-- User dropdown -->
      <div class="relative" ref="userDropdownRef">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div class="w-9 h-9 bg-brand-maroon rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
            A
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-sm font-semibold text-gray-800 leading-tight">Admin</p>
            <p class="text-[11px] text-gray-400">Administrator</p>
          </div>
          <i class="bx bx-chevron-down text-gray-400 hidden sm:block"></i>
        </button>

        <!-- Dropdown -->
        <transition name="dropdown">
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
          >
            <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <i class="bx bx-user text-lg text-gray-400"></i>
              Profil Saya
            </a>
            <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <i class="bx bx-cog text-lg text-gray-400"></i>
              Pengaturan
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <i class="bx bx-log-out text-lg"></i>
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

const store = useAdminStore()
const showUserMenu = ref(false)
const userDropdownRef = ref(null)

const handleLogout = () => {
  // Placeholder — will connect to real auth store later
  showUserMenu.value = false
  window.location.href = '/login'
}

// Close dropdown on outside click
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
</style>
