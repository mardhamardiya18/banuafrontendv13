<template>
  <main class="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 bg-brand-cream-light">
    <div class="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 class="text-6xl font-extrabold tracking-tight text-brand-maroon sm:text-7xl">
        <span class="block">Banua</span>
        <span class="block text-brand-terracotta">Frontend v13</span>
      </h1>
      
      <p class="mt-6 text-xl text-brand-forest-dark max-w-lg mx-auto leading-relaxed">
        Modern, fast, and beautifully crafted frontend foundation for your next big idea.
      </p>
      
      <div class="flex justify-center gap-4">
        <div class="bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-brand-maroon/10 hover:scale-105 transition-all duration-500 w-64 hover:shadow-brand-terracotta/20">
          <h2 class="text-sm font-bold uppercase tracking-widest text-brand-forest-dark mb-4">State Management</h2>
          <div class="text-5xl font-black text-brand-maroon mb-2">{{ counter.count }}</div>
          <p class="text-brand-forest-dark/70 text-sm mb-6">Current count from Pinia</p>
          <button 
            @click="counter.increment"
            class="w-full bg-brand-terracotta hover:bg-brand-maroon text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-brand-terracotta/30 transition-all active:scale-95"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useCounterStore } from '../stores/counter'
const counter = useCounterStore()
</script>
