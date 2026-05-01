<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-100">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-8">
      <RouterLink 
        to="/" 
        class="text-gray-900 font-semibold hover:text-indigo-600 transition-colors"
        active-class="text-indigo-600"
      >
        Home
      </RouterLink>
      <RouterLink 
        to="/about" 
        class="text-gray-900 font-semibold hover:text-indigo-600 transition-colors"
        active-class="text-indigo-600"
      >
        About
      </RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
body {
  @apply bg-gray-50;
}
</style>
