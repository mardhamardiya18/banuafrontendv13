<template>
  <RouterLink :to="'/produk/' + product.slug" class="group min-w-0 flex flex-col rounded-[22px] border border-brand-maroon/5 bg-white p-2 sm:p-3 hover:shadow-lg transition-shadow focus-visible:outline-2 focus-visible:outline-brand-maroon focus-visible:outline-offset-4">
    <ProductPhoto :src="product.img" :name="product.name" class="aspect-[4/3] rounded-2xl" />
    <div class="flex flex-col flex-1 p-2 pt-3 sm:p-3">
      <p class="text-[10px] sm:text-xs text-[#96533f] font-semibold mb-1.5">{{ product.categoryName }}</p>
      <h3 class="text-sm sm:text-base font-bold text-brand-maroon leading-snug line-clamp-2">{{ product.name }}</h3>
      <p v-if="product.minOrder" class="mt-2 text-[10px] sm:text-xs text-gray-500">Min. {{ product.minOrder }} porsi</p>
      <div class="mt-auto pt-4"><p class="text-[10px] text-gray-500 mb-0.5">Harga mulai</p><p class="text-sm sm:text-lg font-extrabold text-brand-maroon break-words">Rp {{ Number(product.price || 0).toLocaleString('id-ID') }}</p><span class="mt-3 flex items-center justify-between border-t border-brand-maroon/10 pt-3 text-[11px] sm:text-xs font-semibold text-brand-maroon">Lihat menu <ArrowUpRight :size="16" aria-hidden="true" /></span></div>
    </div>
  </RouterLink>
</template>
<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import ProductPhoto from './ProductPhoto.vue'
defineProps({ product: { type: Object, required: true } })
</script>