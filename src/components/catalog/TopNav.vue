<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-maroon/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
      <!-- Logo Section -->
      <router-link to="/" class="flex items-center gap-3 group">
        <img :src="logo" alt="Logo" class="h-10 w-auto group-hover:scale-110 transition-transform duration-300">
        <div class="flex flex-col">
          <span class="text-2xl font-extrabold text-brand-maroon tracking-tight">DMI Catering</span>
          <small class="text-xs text-brand-forest-dark/60 font-medium">By Dapur Mamah Iis</small>
        </div>
      </router-link>

      <!-- Desktop Navigation (Conditional) -->
      <div v-if="showMenu" class="hidden md:flex items-center gap-8 text-sm font-bold text-brand-forest-dark">
        <router-link to="/" class="hover:text-brand-terracotta transition-colors duration-300">Beranda</router-link>
        <router-link to="/katalog" class="hover:text-brand-terracotta transition-colors duration-300">Katalog</router-link>
        <a href="/#services" class="hover:text-brand-terracotta transition-colors duration-300">Layanan</a>
        <a href="/#testimonials" class="hover:text-brand-terracotta transition-colors duration-300">Testimoni</a>
        
        <!-- Admin Dashboard Link -->
        <router-link 
          v-if="authStore.isAuthenticated && authStore.isAdmin" 
          to="/admin/dashboard" 
          class="flex items-center gap-1.5 text-brand-maroon font-black hover:text-brand-terracotta transition-colors"
        >
          <i class='bx bxs-dashboard text-lg'></i>
          Admin
        </router-link>
      </div>

      <!-- Action Buttons / Profile -->
      <div class="flex items-center gap-4">
        <a href="https://wa.me/6281234567890" target="_blank" class="hidden md:inline-flex bg-brand-terracotta hover:bg-brand-maroon text-white text-xs font-black px-6 py-2.5 rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-brand-terracotta/20 items-center gap-2 group uppercase tracking-widest">
          Hubungi Kami
          <i class='bx bx-right-arrow-alt text-lg group-hover:translate-x-1 transition-transform'></i>
        </a>
        
        <!-- Profile Image (Authenticated Only) -->
        <template v-if="authStore.isAuthenticated">
          <!-- Admin Profile (with redirect) -->
          <router-link 
            v-if="authStore.isAdmin"
            to="/admin/dashboard"
            class="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-maroon/20 shadow-sm shrink-0 hover:scale-110 hover:border-brand-maroon transition-all duration-300 cursor-pointer group/avatar"
            title="Dashboard Admin"
          >
            <img src="https://placehold.co/100x100/690B22/fff?text=Admin" alt="Admin" class="w-full h-full object-cover" />
          </router-link>
          
          <!-- Regular User Profile -->
          <div v-else class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src="https://placehold.co/100x100/E07A5F/fff?text=User" alt="Profile" class="w-full h-full object-cover" />
          </div>
        </template>

        <!-- Mobile Toggle (Only if menu is shown) -->
        <button v-if="showMenu" @click="mobileMenu = !mobileMenu" class="md:hidden text-brand-maroon">
          <i :class="['bx text-3xl transition-transform duration-300', mobileMenu ? 'bx-x rotate-90' : 'bx-menu']"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu (Conditional) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="mobileMenu && showMenu" class="md:hidden bg-white border-t border-brand-maroon/10 px-4 py-6 space-y-4 shadow-xl">
        <router-link to="/" class="block text-sm font-bold text-brand-forest-dark hover:text-brand-terracotta" @click="mobileMenu=false">Beranda</router-link>
        <router-link to="/katalog" class="block text-sm font-bold text-brand-forest-dark hover:text-brand-terracotta" @click="mobileMenu=false">Katalog</router-link>
        <a href="/#services" class="block text-sm font-bold text-brand-forest-dark hover:text-brand-terracotta" @click="mobileMenu=false">Layanan</a>
        <a href="/#testimonials" class="block text-sm font-bold text-brand-forest-dark hover:text-brand-terracotta" @click="mobileMenu=false">Testimoni</a>
        
        <router-link 
          v-if="authStore.isAuthenticated && authStore.isAdmin" 
          to="/admin/dashboard" 
          class="block text-brand-maroon font-black py-2 border-y border-brand-maroon/5 text-sm" 
          @click="mobileMenu=false"
        >
          <i class='bx bxs-dashboard mr-2'></i> Dashboard Admin
        </router-link>

        <a href="https://wa.me/6281234567890" target="_blank" class="block bg-brand-terracotta text-white text-center py-3 rounded-full font-black text-xs uppercase tracking-widest" @click="mobileMenu=false">Hubungi Kami</a>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useAuthStore } from '../../stores/auth'
import logo from '../../assets/images/logo.png'

const props = defineProps({
  showMenu: {
    type: Boolean,
    default: true
  }
})

const authStore = useAuthStore()
const mobileMenu = ref(false)
</script>
