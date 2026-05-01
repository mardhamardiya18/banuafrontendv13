<template>
  <main class="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 bg-linear-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 class="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
        <span class="block">Banua</span>
        <span class="block text-indigo-600">Frontend v13</span>
      </h1>
      
      <p class="mt-6 text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
        Modern, fast, and beautifully crafted frontend foundation for your next big idea.
      </p>
      
      <div class="flex justify-center gap-4">
        <div class="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 hover:scale-105 transition-all duration-500 w-64 hover:shadow-indigo-200/50">
          <h2 class="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">State Management</h2>
          <div class="text-5xl font-black text-gray-900 mb-2">{{ counter.count }}</div>
          <p class="text-gray-500 text-sm mb-6">Current count from Pinia</p>
          <button 
            @click="counter.increment"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
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
