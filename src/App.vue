<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-white shadow-sm border-b border-brand-maroon/10">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-8 font-medium">
      <RouterLink 
        to="/" 
        class="text-brand-forest-dark hover:text-brand-maroon transition-colors"
        active-class="text-brand-maroon font-bold"
      >
        Home
      </RouterLink>
      <RouterLink 
        to="/admin/dashboard" 
        class="text-brand-forest-dark hover:text-brand-maroon transition-colors"
        active-class="text-brand-maroon font-bold"
      >
        Dashboard
      </RouterLink>
      <RouterLink 
        to="/login" 
        class="text-brand-forest-dark hover:text-brand-maroon transition-colors"
        active-class="text-brand-maroon font-bold"
      >
        Login
      </RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>
