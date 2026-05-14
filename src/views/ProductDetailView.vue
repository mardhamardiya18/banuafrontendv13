<template>
  <div class="min-h-screen bg-[#FDFBF7] font-sans text-brand-forest-dark selection:bg-brand-terracotta/20">
    <TopNav :showMenu="false" />

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-[100] bg-white/90 backdrop-blur-lg flex flex-col items-center justify-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-brand-terracotta/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-brand-terracotta rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-brand-maroon font-bold tracking-widest uppercase text-xs animate-pulse">Menyiapkan Hidangan...</p>
    </div>

    <!-- Centered Page Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 lg:pt-32">
      
      <!-- Quick Navigation & Breadcrumb -->
      <div class="mb-10 lg:mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button 
          @click="$router.back()" 
          class="group flex items-center gap-3 text-gray-400 hover:text-brand-maroon transition-all duration-300 shrink-0"
        >
          <div class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-brand-maroon group-hover:bg-brand-maroon/5 transition-all">
            <i class='bx bx-left-arrow-alt text-2xl group-hover:-translate-x-1 transition-transform'></i>
          </div>
          <span class="text-xs font-bold uppercase tracking-[0.2em]">Kembali</span>
        </button>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <router-link to="/" class="hover:text-brand-maroon transition-colors">Beranda</router-link>
          <i class='bx bx-chevron-right text-base'></i>
          <router-link to="/katalog" class="hover:text-brand-maroon transition-colors">Katalog</router-link>
          <i class='bx bx-chevron-right text-base'></i>
          <span class="text-brand-maroon truncate max-w-[150px] lg:max-w-none">{{ product.name }}</span>
        </nav>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        <!-- LEFT COLUMN: Gallery & Description -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-5 lg:space-y-24">
          
          <!-- Gallery Slider -->
          <div class="relative -mx-4 sm:mx-0 ">
            <swiper
              :modules="modules"
              :slides-per-view="'auto'"
              :centered-slides="true"
              :space-between="20"
              :pagination="{ clickable: true }"
              class="product-detail-swiper pb-14!"
            >
              <swiper-slide v-for="(img, index) in productImages" :key="index" class="w-[85%]! sm:w-[70%]!">
                <div class="aspect-[3/4] rounded-4xl overflow-hidden shadow-2xl shadow-brand-maroon/5 border border-white isolate">
                  <img :src="img" :alt="product.name" class="w-full h-full object-cover" />
                </div>
              </swiper-slide>
            </swiper>
          </div>

          <!-- Description -->
          <div class="max-w-3xl animate-fade-up">
            <div class="flex items-center gap-4 mb-8">
              <div class="h-px flex-1 bg-gray-300"></div>
              <h3 class="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Deskripsi Produk</h3>
              <div class="h-px flex-1 bg-gray-300"></div>
            </div>
            <div class="text-gray-500 leading-[1.8] text-lg font-medium description-content" v-html="product.description">
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Sidebar Info -->
        <div class="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-12 space-y-8">
          <div class="bg-white rounded-[3rem] p-8 lg:p-12 shadow-[0_30px_100px_rgba(105,11,34,0.06)] border border-brand-maroon/5 space-y-10">
            
            <!-- Tags & Badge -->
            <div class="flex flex-wrap gap-2">
              <span v-if="product.is_recommended" class="bg-brand-terracotta/10 text-brand-terracotta text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                Rekomendasi
              </span>
              <span class="bg-brand-maroon/5 text-brand-maroon text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                {{ product.category?.name || 'Catering Banua' }}
              </span>
            </div>

            <!-- Title -->
            <div class="space-y-6">
              <h1 class="text-4xl font-black text-brand-maroon leading-[1.1] tracking-tight">
                {{ product.name }}
              </h1>
              
              <!-- Rating (Design Only, without total review) -->
              <div class="flex items-center gap-3">
                <div class="flex items-center bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-100 shadow-sm shadow-amber-900/5">
                  <i class='bx bxs-star text-amber-400 text-base mr-2'></i>
                  <span class="text-amber-800 font-black text-sm">4.9</span>
                </div>
                <div class="h-4 w-px bg-gray-200"></div>
                <span class="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Semua pada suka😍</span>
              </div>
            </div>

            <!-- Price Card -->
            <div class="p-8 bg-brand-cream-light/30 rounded-4xl border border-brand-cream-light/50">
              <p class="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3">Harga Per Porsi</p>
              <div class="flex items-baseline gap-2">
                <span class="text-brand-terracotta font-black text-xl italic">Rp</span>
                <span class="text-4xl font-black text-brand-maroon tracking-tighter">
                  {{ formatPriceValue(product.price) }}
                </span>
              </div>
              <p v-if="product.discount > 0" class="mt-2 text-xs font-bold text-green-600 italic">
                <i class='bx bxs-discount'></i> Diskon {{ product.discount }}% Tersedia
              </p>
            </div>

            <!-- Highlight Points -->
            <div class="grid grid-cols-1 gap-6">
              <div class="flex items-center gap-5 group">
                <div class="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-brand-maroon/5 flex items-center justify-center text-brand-terracotta border border-gray-50 transition-all duration-500 group-hover:scale-110">
                  <i class='bx bx-package text-2xl'></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Min. Order</p>
                  <p class="font-extrabold text-brand-forest-dark">{{ product.min_order || 20 }} Porsi</p>
                </div>
              </div>

              <div class="flex items-center gap-5 group">
                <div class="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-brand-maroon/5 flex items-center justify-center text-brand-maroon border border-gray-50 transition-all duration-500 group-hover:scale-110">
                  <i class='bx bx-timer text-2xl'></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Waktu Tunggu</p>
                  <p class="font-extrabold text-brand-forest-dark">Pre-Order (PO)</p>
                </div>
              </div>
            </div>

            <!-- CTA Action (Direct to WhatsApp as per Business Flow) -->
            <div class="pt-8">
              <a 
                :href="whatsappLink" 
                target="_blank"
                class="group w-full flex items-center justify-between p-2 pl-8 bg-brand-maroon rounded-full shadow-[0_20px_40px_-15px_rgba(105,11,34,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(105,11,34,0.7)] hover:-translate-y-1 active:scale-95 transition-all duration-500 border border-white/10 relative overflow-hidden"
              >
                <!-- Premium Shimmer Effect -->
                <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                <span class="text-[13px] font-black text-white uppercase tracking-[0.2em] relative z-10">Pesan Sekarang</span>
                
                <div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center relative z-10 shadow-inner group-hover:scale-105 group-hover:bg-[#25D366] transition-all duration-500">
                  <i class='bx bxl-whatsapp text-2xl text-white group-hover:scale-110 transition-transform duration-300'></i>
                </div>
              </a>
            </div>
          </div>



        </div>
      </div>

      <!-- SIMILAR PRODUCTS (Based on Contract v2 related_products) -->
      <div v-if="similarProducts.length > 0" class="mt-24 lg:mt-48 space-y-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-2">
            <span class="text-brand-terracotta text-[10px] font-black uppercase tracking-[0.3em]">Rekomendasi</span>
            <h3 class="text-3xl lg:text-4xl font-black text-brand-maroon tracking-tight">Produk Serupa</h3>
          </div>
          <router-link to="/katalog" class="group flex items-center gap-3 text-brand-maroon font-black text-xs uppercase tracking-widest hover:text-brand-terracotta transition-colors">
            Lihat Semua Katalog
            <i class='bx bx-right-top-arrow-circle text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'></i>
          </router-link>
        </div>

        <swiper
          :slides-per-view="1.3"
          :space-between="16"
          :breakpoints="{
            '640': { slidesPerView: 2.2, spaceBetween: 20 },
            '768': { slidesPerView: 3.2, spaceBetween: 20 },
            '1024': { slidesPerView: 4, spaceBetween: 24 },
            '1280': { slidesPerView: 4, spaceBetween: 24 }
          }"
          class="similar-products-swiper overflow-visible!"
        >
          <swiper-slide v-for="item in similarProducts" :key="item.id">
            <div 
              @click="router.push(`/produk/${item.slug}`)"
              class="group cursor-pointer space-y-4"
            >
              <div class="relative aspect-4/5 rounded-4xl overflow-hidden bg-white shadow-lg shadow-brand-maroon/5 border border-white transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-brand-terracotta/20">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-115" />
              </div>

              <div class="px-1 space-y-1">
                <h4 class="font-bold text-brand-forest-dark text-sm lg:text-base truncate group-hover:text-brand-terracotta transition-colors duration-300">
                  {{ item.name }}
                </h4>
                <div class="flex items-center gap-2">
                  <span class="text-brand-maroon font-black text-xs lg:text-sm italic">
                    {{ formatPrice(item.price) }}
                  </span>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import catalogApi from '../api/catalogApi'
import TopNav from '../components/catalog/TopNav.vue'
import Footer from '../components/catalog/Footer.vue'

import 'swiper/css'
import 'swiper/css/pagination'

const route = useRoute()
const router = useRouter()
const modules = [Pagination]
const loading = ref(true)

const product = ref({
  name: 'Memuat...',
  price: 0,
  description: '',
  category: null,
  add_ons: [],
  is_recommended: false,
  discount: 0
})

const productImages = ref([])
const similarProducts = ref([])

const fetchProductDetail = async () => {
  loading.value = true
  try {
    const slug = route.params.slug
    const res = await catalogApi.getProductDetail(slug)
    
    if (res.success && res.data) {
      const data = res.data
      product.value = data
      
      // Images mapping from Contract v2 galleries
      if (data.galleries && data.galleries.length > 0) {
        productImages.value = data.galleries.map(g => g.image_url)
      } else {
        productImages.value = ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop']
      }
      
      // Related products mapping
      if (data.related_products && data.related_products.length > 0) {
        similarProducts.value = data.related_products.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop'
        }))
      } else {
        similarProducts.value = []
      }
    }
  } catch (error) {
    console.error('Error fetching product detail:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatPriceValue = (value) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0
  }).format(value)
}

const whatsappLink = computed(() => {
  const message = `Halo Min! Rencananya mau pesen "${product.value.name}" nih. Kira-kira buat ordernya gimana ya?`
  return `https://wa.me/6285156253408?text=${encodeURIComponent(message)}`
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    fetchProductDetail()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
:deep(.product-detail-swiper .swiper-pagination) {
  bottom: 0px !important;
  z-index: 50;
}
:deep(.product-detail-swiper .swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: #690B22;
  opacity: 0.15;
  margin: 0 5px !important;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.product-detail-swiper .swiper-pagination-bullet-active) {
  width: 32px;
  background: #690B22 !important;
  opacity: 1;
  border-radius: 10px;
}
.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}
.description-content :deep(b), .description-content :deep(strong) { font-weight: 800; color: #1f2937; }
.description-content :deep(p) { margin-bottom: 1rem; }
.description-content :deep(ul) { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
.description-content :deep(ol) { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
.description-content :deep(h1) { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; }
.description-content :deep(h2) { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; }
.description-content :deep(h3) { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
</style>
