<template>
  <!-- Mobile Backdrop -->
  <transition name="sidebar-backdrop">
    <div
      v-if="store.sidebarMobileOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
      @click="store.toggleMobileSidebar()"
    ></div>
  </transition>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out"
    :class="[
      store.sidebarOpen ? 'w-[260px]' : 'w-[80px]',
      store.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Brand -->
    <div class="h-[72px] flex items-center gap-3 px-5 border-b border-gray-100 shrink-0">
      <div class="w-10 h-10 bg-brand-maroon rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-maroon/20">
        <i class="bx bxs-bowl-hot text-xl text-white"></i>
      </div>
      <transition name="text-fade">
        <div v-if="store.sidebarOpen" class="overflow-hidden whitespace-nowrap">
          <h1 class="text-lg font-bold text-gray-900 leading-tight">DMI Catering</h1>
          <p class="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Admin Panel</p>
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
      <p v-if="store.sidebarOpen" class="px-3 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menu Utama</p>
      
      <router-link
        v-for="item in mainMenu"
        :key="item.route"
        :to="item.route"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive(item.route)
          ? 'bg-brand-maroon/5 text-brand-maroon'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
        @click="store.sidebarMobileOpen && store.toggleMobileSidebar()"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
             :class="isActive(item.route) ? 'bg-brand-maroon text-white shadow-sm' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'">
          <i :class="item.icon" class="text-lg"></i>
        </div>
        <span v-if="store.sidebarOpen" class="truncate">{{ item.label }}</span>
        <span v-if="store.sidebarOpen && item.badge" class="ml-auto text-[10px] font-bold bg-brand-terracotta text-white px-2 py-0.5 rounded-full">{{ item.badge }}</span>
      </router-link>

      <div v-if="store.sidebarOpen" class="pt-4 pb-2">
        <p class="px-3 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Katalog</p>
      </div>
      <div v-else class="pt-3"></div>

      <router-link
        v-for="item in catalogMenu"
        :key="item.route"
        :to="item.route"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive(item.route)
          ? 'bg-brand-maroon/5 text-brand-maroon'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
        @click="store.sidebarMobileOpen && store.toggleMobileSidebar()"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
             :class="isActive(item.route) ? 'bg-brand-maroon text-white shadow-sm' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'">
          <i :class="item.icon" class="text-lg"></i>
        </div>
        <span v-if="store.sidebarOpen" class="truncate">{{ item.label }}</span>
      </router-link>

      <div v-if="store.sidebarOpen" class="pt-4 pb-2">
        <p class="px-3 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaksi</p>
      </div>
      <div v-else class="pt-3"></div>

      <router-link
        v-for="item in transactionMenu"
        :key="item.route"
        :to="item.route"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive(item.route)
          ? 'bg-brand-maroon/5 text-brand-maroon'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
        @click="store.sidebarMobileOpen && store.toggleMobileSidebar()"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
             :class="isActive(item.route) ? 'bg-brand-maroon text-white shadow-sm' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'">
          <i :class="item.icon" class="text-lg"></i>
        </div>
        <span v-if="store.sidebarOpen" class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Website Link (Back to Home) -->
    <div class="px-3 pb-2">
      <router-link
        to="/"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all duration-200 group"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600 shrink-0 group-hover:bg-emerald-200">
          <i class="bx bx-world text-lg"></i>
        </div>
        <span v-if="store.sidebarOpen" class="truncate">Lihat Website</span>
      </router-link>
    </div>

    <!-- Collapse Toggle (Desktop) -->
    <div class="hidden lg:flex p-3 border-t border-gray-100">
      <button
        @click="store.toggleSidebar()"
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all text-sm"
      >
        <i :class="store.sidebarOpen ? 'bx bx-chevrons-left' : 'bx bx-chevrons-right'" class="text-xl"></i>
        <span v-if="store.sidebarOpen" class="font-medium">Tutup Sidebar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAdminStore } from '../../stores/admin'

const route = useRoute()
const store = useAdminStore()

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const mainMenu = [
  { label: 'Dashboard', icon: 'bx bxs-dashboard', route: '/admin/dashboard' }
]

const catalogMenu = [
  { label: 'Kategori', icon: 'bx bxs-category', route: '/admin/categories' },
  { label: 'Produk', icon: 'bx bxs-box', route: '/admin/products' },
  { label: 'Add-Ons', icon: 'bx bxs-plus-circle', route: '/admin/add-ons' },
  { label: 'Gallery', icon: 'bx bxs-image', route: '/admin/gallery' }
]

const transactionMenu = [
  { label: 'Order', icon: 'bx bxs-cart', route: '/admin/orders', badge: '3' },
  { label: 'Bank Account', icon: 'bx bxs-bank', route: '/admin/bank-accounts' }
]
</script>

<style scoped>
.text-fade-enter-active { transition: opacity 0.2s ease 0.1s; }
.text-fade-leave-active { transition: opacity 0.1s ease; }
.text-fade-enter-from,
.text-fade-leave-to { opacity: 0; }

.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active { transition: opacity 0.3s ease; }
.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
</style>
