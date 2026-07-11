<template>
  <!-- Mobile Backdrop -->
  <transition name="sidebar-backdrop">
    <div
      v-if="store.sidebarMobileOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      @click="store.toggleMobileSidebar()"
    ></div>
  </transition>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out"
    :style="{
      width: store.sidebarOpen ? '260px' : '80px',
      background: 'linear-gradient(180deg, #0f0f17 0%, #141420 50%, #0f0f17 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }"
    :class="store.sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Decorative top glow -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Brand -->
    <div class="h-[72px] flex items-center gap-3 px-4 shrink-0 relative"
         :style="{ borderBottom: '1px solid rgba(255,255,255,0.05)' }">
      <!-- Logo image -->
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden p-0.5"
           style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);">
        <img :src="logoImg" alt="DMI Catering" class="w-full h-full object-contain" />
      </div>
      <transition name="text-fade">
        <div v-if="store.sidebarOpen" class="overflow-hidden whitespace-nowrap">
          <h1 class="text-sm font-bold leading-tight" style="color: #e0e0ef;">DMI Catering</h1>
          <p class="text-[10px] font-semibold tracking-wider"
             style="color: rgba(224,122,95,0.75);">By Dapur Mamah Iis</p>
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-5 overflow-y-auto admin-scrollbar" style="display: flex; flex-direction: column; gap: 2px;">

      <!-- Section: Main -->
      <p v-if="store.sidebarOpen"
         class="px-3 mb-2 text-[9px] font-bold uppercase"
         style="letter-spacing: 0.15em; color: rgba(160,160,192,0.4);">Menu Utama</p>

      <router-link
        v-for="item in mainMenu"
        :key="item.route"
        :to="item.route"
        custom
        v-slot="{ navigate, isActive: linkActive }"
      >
        <button
          @click="() => { navigate(); store.sidebarMobileOpen && store.toggleMobileSidebar(); }"
          class="nav-link-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden"
          :class="[!store.sidebarOpen ? 'justify-center' : '', linkActive ? 'nav-active' : 'nav-default']"
        >
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full transition-opacity duration-200"
               :style="{ background: 'linear-gradient(180deg, #a78bfa, #8b5cf6)', opacity: linkActive ? 1 : 0 }"></div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
               :style="linkActive
                 ? 'background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.3);'
                 : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);'">
            <component :is="item.icon" :size="17"
                       :style="{ color: linkActive ? '#a78bfa' : 'rgba(160,160,192,0.6)' }" />
          </div>
          <span v-if="store.sidebarOpen" class="truncate flex-1 text-left"
                :style="{ color: linkActive ? '#e0e0ef' : 'rgba(160,160,192,0.65)' }">
            {{ item.label }}
          </span>
        </button>
      </router-link>

      <!-- Section: Katalog -->
      <div :class="store.sidebarOpen ? 'pt-5 pb-1' : 'pt-4'">
        <p v-if="store.sidebarOpen"
           class="px-3 mb-2 text-[9px] font-bold uppercase"
           style="letter-spacing: 0.15em; color: rgba(160,160,192,0.4);">Katalog</p>
        <div v-else class="mx-3 h-px" style="background: rgba(255,255,255,0.05);"></div>
      </div>

      <router-link
        v-for="item in catalogMenu"
        :key="item.route"
        :to="item.route"
        custom
        v-slot="{ navigate, isActive: linkActive }"
      >
        <button
          @click="() => { navigate(); store.sidebarMobileOpen && store.toggleMobileSidebar(); }"
          class="nav-link-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden"
          :class="[!store.sidebarOpen ? 'justify-center' : '', linkActive ? 'nav-active' : 'nav-default']"
        >
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full transition-opacity duration-200"
               :style="{ background: 'linear-gradient(180deg, #a78bfa, #8b5cf6)', opacity: linkActive ? 1 : 0 }"></div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
               :style="linkActive
                 ? 'background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.3);'
                 : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);'">
            <component :is="item.icon" :size="17"
                       :style="{ color: linkActive ? '#a78bfa' : 'rgba(160,160,192,0.6)' }" />
          </div>
          <span v-if="store.sidebarOpen" class="truncate flex-1 text-left"
                :style="{ color: linkActive ? '#e0e0ef' : 'rgba(160,160,192,0.65)' }">
            {{ item.label }}
          </span>
        </button>
      </router-link>

      <!-- Section: Transaksi -->
      <div :class="store.sidebarOpen ? 'pt-5 pb-1' : 'pt-4'">
        <p v-if="store.sidebarOpen"
           class="px-3 mb-2 text-[9px] font-bold uppercase"
           style="letter-spacing: 0.15em; color: rgba(160,160,192,0.4);">Transaksi</p>
        <div v-else class="mx-3 h-px" style="background: rgba(255,255,255,0.05);"></div>
      </div>

      <router-link
        v-for="item in transactionMenu"
        :key="item.route"
        :to="item.route"
        custom
        v-slot="{ navigate, isActive: linkActive }"
      >
        <button
          @click="() => { navigate(); store.sidebarMobileOpen && store.toggleMobileSidebar(); }"
          class="nav-link-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden"
          :class="[!store.sidebarOpen ? 'justify-center' : '', linkActive ? 'nav-active' : 'nav-default']"
        >
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full transition-opacity duration-200"
               :style="{ background: 'linear-gradient(180deg, #a78bfa, #8b5cf6)', opacity: linkActive ? 1 : 0 }"></div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
               :style="linkActive
                 ? 'background: rgba(139,92,246,0.2); border: 1px solid rgba(139,92,246,0.3);'
                 : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);'">
            <component :is="item.icon" :size="17"
                       :style="{ color: linkActive ? '#a78bfa' : 'rgba(160,160,192,0.6)' }" />
          </div>
          <span v-if="store.sidebarOpen" class="truncate flex-1 text-left"
                :style="{ color: linkActive ? '#e0e0ef' : 'rgba(160,160,192,0.65)' }">
            {{ item.label }}
          </span>
          <span v-if="store.sidebarOpen && item.badge"
                class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto"
                style="background: rgba(224,122,95,0.2); color: #E07A5F; border: 1px solid rgba(224,122,95,0.3);">
            {{ item.badge }}
          </span>
        </button>
      </router-link>

      <!-- Section: Pengaturan (Store Closed Toggle) -->
      <div :class="store.sidebarOpen ? 'pt-5 pb-1' : 'pt-4'">
        <p v-if="store.sidebarOpen"
           class="px-3 mb-2 text-[9px] font-bold uppercase"
           style="letter-spacing: 0.15em; color: rgba(160,160,192,0.4);">Pengaturan</p>
        <div v-else class="mx-3 h-px" style="background: rgba(255,255,255,0.05);"></div>
      </div>
      
      <div class="px-3 py-2">
        <div class="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
             :style="'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);'">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                 :style="'background: rgba(224,122,95,0.1); border: 1px solid rgba(224,122,95,0.2);'">
              <StoreIcon :size="17" style="color: #E07A5F;" />
            </div>
            <span v-if="store.sidebarOpen" class="text-sm font-medium" style="color: rgba(160,160,192,0.9);">
              Toko Tutup
            </span>
          </div>
          <!-- Toggle Button -->
          <button v-if="store.sidebarOpen"
                  @click="settingsStore.toggleStoreStatus()"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#141420] transition-colors duration-200"
                  :class="settingsStore.isStoreClosed ? 'bg-red-500' : 'bg-gray-600'"
                  role="switch"
                  :aria-checked="settingsStore.isStoreClosed">
            <span class="sr-only">Toko Tutup Toggle</span>
            <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="settingsStore.isStoreClosed ? 'translate-x-2' : '-translate-x-2'"></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Website Link (Back to Home) -->
    <div class="px-3 pb-2">
      <router-link to="/" custom v-slot="{ navigate }">
        <button
          @click="navigate"
          class="nav-link-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="!store.sidebarOpen ? 'justify-center' : ''"
          style="color: rgba(52, 211, 153, 0.8);"
        >
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
               style="background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.2);">
            <Globe :size="17" style="color: rgba(52, 211, 153, 0.9);" />
          </div>
          <span v-if="store.sidebarOpen" class="truncate text-left text-sm font-medium">Lihat Website</span>
        </button>
      </router-link>
    </div>

    <!-- Collapse Toggle (Desktop) -->
    <div class="hidden lg:flex p-3" :style="{ borderTop: '1px solid rgba(255,255,255,0.05)' }">
      <button
        @click="store.toggleSidebar()"
        class="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl transition-all duration-200 text-sm"
        :class="!store.sidebarOpen ? 'justify-center' : ''"
        style="color: rgba(160,160,192,0.5);"
        onmouseenter="this.style.background='rgba(255,255,255,0.04)'; this.style.color='rgba(160,160,192,0.9)';"
        onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.5)';"
      >
        <component :is="store.sidebarOpen ? ChevronsLeft : ChevronsRight"
                   :size="18" class="shrink-0 transition-transform duration-200" />
        <span v-if="store.sidebarOpen" class="font-medium text-xs">Tutup Sidebar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '../../stores/admin'
import { orderApi } from '../../api/apiService'
import {
  LayoutDashboard, Tag, Package, PlusCircle, Image, ShoppingCart, Landmark,
  Globe, ChevronsLeft, ChevronsRight, Store as StoreIcon
} from '@lucide/vue'
import logoImg from '../../assets/images/logo-small.webp'

const route = useRoute()
const store = useAdminStore()

import { useSettingsStore } from '../../stores/settings'
const settingsStore = useSettingsStore()

const mainMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' }
]

const catalogMenu = [
  { label: 'Kategori', icon: Tag, route: '/admin/categories' },
  { label: 'Produk', icon: Package, route: '/admin/products' },
  { label: 'Add-Ons', icon: PlusCircle, route: '/admin/add-ons' },
  { label: 'Gallery', icon: Image, route: '/admin/gallery' }
]

const transactionMenu = ref([
  { label: 'Order', icon: ShoppingCart, route: '/admin/orders', badge: '' },
  { label: 'Bank Account', icon: Landmark, route: '/admin/bank-accounts' }
])

onMounted(async () => {
  try {
    const res = await orderApi.getAll(1, 1000, '', 'pending')
    if (res.status === 'success') {
      const validOrders = res.data.filter(o => 
        o.status?.payment === 'dp_received' || o.status?.payment === 'paid'
      )
      transactionMenu.value[0].badge = validOrders.length > 0 ? validOrders.length.toString() : ''
    }
  } catch (error) {
    console.error('Error fetching pending orders count:', error)
  }
})
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

.nav-active {
  background: rgba(139, 92, 246, 0.08);
}

.nav-default:hover {
  background: rgba(255, 255, 255, 0.04);
}

.nav-link-btn {
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
}
</style>
