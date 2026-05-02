<template>
  <div class="min-h-screen bg-gray-50/50">
    <Sidebar />
    <div
      class="transition-all duration-300 ease-in-out"
      :class="store.sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[80px]'"
    >
      <Topbar />
      <main class="p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <ToastNotification />
  </div>
</template>

<script setup>
import Sidebar from '../../components/admin/Sidebar.vue'
import Topbar from '../../components/admin/Topbar.vue'
import ToastNotification from '../../components/admin/ToastNotification.vue'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
</script>

<style scoped>
.page-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-leave-active { transition: opacity 0.15s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; }
</style>
