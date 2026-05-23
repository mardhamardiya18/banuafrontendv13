<template>
  <router-link 
    :to="`/produk/${product.slug}`"
    class="bg-white rounded-4xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group flex flex-col h-full decoration-none"
  >
    <!-- Heart Icon -->
    <button @click.prevent.stop class="absolute top-4 right-4 z-10 text-gray-300 hover:text-brand-terracotta transition-colors" aria-label="Tandai sebagai favorit">
      <i class="bx bx-heart text-xl" aria-hidden="true"></i>
    </button>

    <!-- Product Image in Circular Inset -->
    <div class="relative w-full aspect-square rounded-full bg-gray-50/80 p-2 mb-4 shrink-0 mx-auto max-w-[160px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
      <img 
        :src="product.img" 
        :alt="product.name" 
        loading="lazy"
        decoding="async"
        width="160"
        height="160"
        class="w-full h-full object-cover rounded-full bg-gray-100" 
        @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'"
      />
    </div>

    <!-- Product Info -->
    <div class="flex-1 flex flex-col px-1">
      <h3 class="text-[15px] font-bold text-gray-900 mb-1 line-clamp-2 leading-tight tracking-tight group-hover:text-brand-terracotta transition-colors">{{ product.name }}</h3>
      
      <div class="flex items-start justify-between gap-2 mt-auto mb-3 w-full">
        <div class="flex-1 flex items-center min-w-0">
          <span 
            class="inline-block text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full w-auto max-w-full break-words text-left leading-tight"
            :class="getCategoryBadgeClass(product.categoryName)"
          >
            {{ product.categoryName }}
          </span>
        </div>
        <div class="flex items-center gap-1 shrink-0 ml-auto pt-0.5">
          <i class="bx bxs-star text-amber-400 text-[10px] sm:text-xs" aria-hidden="true"></i>
          <span class="text-[10px] sm:text-[11px] font-medium text-gray-400">{{ product.rating }}</span>
        </div>
      </div>

      <!-- Price & Add Button -->
      <div class="flex items-center justify-between mt-1">
        <div class="flex flex-col">
          <span class="text-[10px] text-gray-400 font-medium -mb-1">Mulai dari</span>
          <p class="text-[15px] font-extrabold text-gray-900">Rp {{ Number(product.price || 0).toLocaleString('id-ID') }}</p>
        </div>
        <button @click.prevent.stop class="w-8 h-8 rounded-xl bg-brand-terracotta text-white flex items-center justify-center hover:bg-brand-maroon transition-colors shadow-sm active:scale-90" :aria-label="'Tambah ' + product.name + ' ke keranjang'">
          <i class="bx bx-plus text-lg" aria-hidden="true"></i>
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

const getCategoryBadgeClass = (categoryName) => {
  if (!categoryName) return 'bg-gray-50 text-gray-500 border border-gray-200'
  
  const colors = [
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-cyan-50 text-cyan-700 border-cyan-200',
    'bg-orange-50 text-orange-700 border-orange-200',
    'bg-teal-50 text-teal-700 border-teal-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-pink-50 text-pink-700 border-pink-200',
  ]
  
  let hash = 0
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % colors.length
  return `${colors[index]} border`
}
</script>
