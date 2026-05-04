<template>
  <router-link 
    :to="`/produk/${product.slug}`"
    class="bg-white rounded-4xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group flex flex-col h-full decoration-none"
  >
    <!-- Heart Icon -->
    <button @click.prevent.stop class="absolute top-4 right-4 z-10 text-gray-300 hover:text-brand-terracotta transition-colors">
      <i class="bx bx-heart text-xl"></i>
    </button>

    <!-- Product Image in Circular Inset -->
    <div class="relative w-full aspect-square rounded-full bg-gray-50/80 p-2 mb-4 shrink-0 mx-auto max-w-[160px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
      <img 
        :src="product.img" 
        :alt="product.name" 
        class="w-full h-full object-cover rounded-full bg-gray-100" 
        @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'"
      />
    </div>

    <!-- Product Info -->
    <div class="flex-1 flex flex-col px-1">
      <h3 class="text-[15px] font-bold text-gray-900 mb-1 line-clamp-2 leading-tight tracking-tight group-hover:text-brand-terracotta transition-colors">{{ product.name }}</h3>
      
      <div class="flex items-center gap-3 mt-auto mb-3">
        <div class="flex items-center gap-1 text-gray-400">
          <span class="text-[11px] font-medium">{{ product.time }}</span>
        </div>
        <div class="flex items-center gap-1 ml-auto">
          <i class="bx bxs-star text-amber-400 text-xs"></i>
          <span class="text-[11px] font-medium text-gray-400">{{ product.rating }}</span>
        </div>
      </div>

      <!-- Price & Add Button -->
      <div class="flex items-center justify-between mt-1">
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-medium -mb-1">Mulai dari</span>
          <p class="text-[15px] font-extrabold text-gray-900">Rp {{ Number(product.price || 0).toLocaleString('id-ID') }}</p>
        </div>
        <button @click.prevent.stop class="w-8 h-8 rounded-xl bg-brand-terracotta text-white flex items-center justify-center hover:bg-brand-maroon transition-colors shadow-sm active:scale-90">
          <i class="bx bx-plus text-lg"></i>
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>
