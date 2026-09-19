<template>
  <section class="mx-6 mt-10 rounded-[28px] bg-[#f2e9df] border border-brand-maroon/5 py-6 sm:py-8" aria-labelledby="recommended-title">
    <header class="px-5 sm:px-7 flex items-end justify-between gap-4">
      <div>
        <p class="flex items-center gap-2 text-[10px] font-bold tracking-[.16em] uppercase text-[#96533f]"><Sparkles :size="14" aria-hidden="true" /> Pilihan Dapur Mamah Iis</p>
        <h2 id="recommended-title" class="text-2xl md:text-3xl font-extrabold tracking-tight text-brand-maroon mt-2">Menu yang kami <em class="font-serif font-normal">rekomendasikan</em></h2>
        <p class="text-xs sm:text-sm text-[#786356] mt-2">Pilihan istimewa untuk melengkapi momenmu.</p>
      </div>
      <div v-if="products.length > 1" class="hidden md:flex gap-2 shrink-0">
        <button @click="slide(-1)" :disabled="atStart" aria-label="Rekomendasi sebelumnya" class="reco-nav"><ChevronLeft :size="20" /></button>
        <button @click="slide(1)" :disabled="atEnd" aria-label="Rekomendasi berikutnya" class="reco-nav"><ChevronRight :size="20" /></button>
      </div>
    </header>
    <div ref="track" class="reco-track" @scroll.passive="updateEdges">
      <RouterLink v-for="product in products" :key="product.id" :to="`/produk/${product.slug}`" class="reco-card group">
        <div class="relative">
          <ProductPhoto :src="product.img" :name="product.name" class="aspect-[16/10]" />
          <span class="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#fffaf0]/95 px-3 py-1.5 text-[10px] font-bold text-brand-maroon"><Sparkles :size="12" aria-hidden="true" /> Rekomendasi</span>
          <span v-if="product.discount > 0" class="absolute bottom-3 right-3 rounded-lg bg-brand-maroon px-2.5 py-1.5 text-[10px] font-bold text-white">Diskon {{ product.discount }}%</span>
        </div>
        <div class="p-4 sm:p-5 flex flex-col flex-1">
          <p class="text-[10px] uppercase tracking-wider font-bold text-[#96533f]">{{ product.categoryName }}</p>
          <h3 class="font-body mt-2 font-bold text-lg leading-snug text-brand-maroon line-clamp-2">{{ product.name }}</h3>
          <p v-if="product.minOrder" class="mt-2 text-xs text-gray-500">Pemesanan mulai {{ product.minOrder }} porsi</p>
          <div class="mt-auto pt-5 flex items-end justify-between gap-2">
            <div class="min-w-0"><p class="text-[10px] text-gray-500">Harga mulai</p><p class="text-lg sm:text-xl font-extrabold tracking-tight text-brand-maroon break-words">Rp {{ Number(product.price || 0).toLocaleString('id-ID') }}</p></div>
            <span class="w-10 h-10 shrink-0 rounded-full bg-brand-maroon text-white grid place-items-center group-hover:bg-brand-terracotta transition-colors"><ArrowUpRight :size="19" aria-hidden="true" /><span class="sr-only">Lihat menu</span></span>
          </div>
        </div>
      </RouterLink>
    </div>
    <p v-if="products.length > 1" class="px-5 text-[10px] text-[#786356] flex items-center gap-2 md:hidden"><MoveHorizontal :size="14" aria-hidden="true" /> Geser untuk pilihan lainnya</p>
  </section>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Sparkles, ChevronLeft, ChevronRight, ArrowUpRight, MoveHorizontal } from 'lucide-vue-next'
import ProductPhoto from './ProductPhoto.vue'
const props = defineProps({ products: { type: Array, required: true } })
const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
let observer
function updateEdges() {
  if (!track.value) return
  atStart.value = track.value.scrollLeft < 2
  atEnd.value = track.value.scrollLeft + track.value.clientWidth >= track.value.scrollWidth - 2
}
function slide(direction) {
  track.value?.scrollBy({ left: direction * (track.value.querySelector('a').offsetWidth + 16), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
watch(() => props.products, async () => { await nextTick(); updateEdges() })
onMounted(() => { observer = new ResizeObserver(updateEdges); observer.observe(track.value); updateEdges() })
onBeforeUnmount(() => observer?.disconnect())
</script>
<style scoped>
.reco-track { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 24px 28px 18px; scroll-padding-inline: 28px; scrollbar-width: thin; scrollbar-color: #c9ada0 transparent; }
.reco-card { display: flex; flex-direction: column; flex: 0 0 calc((100% - 32px) / 3); min-width: 0; overflow: hidden; background: #fffdf9; border-radius: 20px; scroll-snap-align: start; border: 1px solid #690b220a; }
.reco-card:focus-visible { outline: 2px solid #690b22; outline-offset: 3px; }
.reco-nav { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid #690b2225; color: #690b22; background: #fffaf0; }
.reco-nav:disabled { opacity: .3; cursor: default; }
@media(max-width: 1023px) { .reco-card { flex-basis: calc((100% - 16px) / 2); } }
@media(max-width: 639px) { .reco-track { padding-inline: 20px; scroll-padding-inline: 20px; } .reco-card { flex-basis: 92%; } }
</style>
