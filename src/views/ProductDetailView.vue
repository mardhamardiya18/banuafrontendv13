<template>
  <!-- Main Wrapper with Background matching other pages -->
  <div class="min-h-screen bg-[#FDFBF7] font-sans">
    
    <!-- Centered Page Container -->
    <div class="max-w-7xl mx-auto bg-white min-h-screen relative shadow-2xl lg:shadow-sm overflow-hidden">
      
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-terracotta"></div>
        <p class="mt-4 text-gray-500 font-medium animate-pulse">Menyiapkan hidangan...</p>
      </div>

      <!-- Topbar (Melayang - Relative to Container on Desktop) -->
      <div class="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-8 pointer-events-none">
        <button 
          @click="$router.back()" 
          class="w-12 h-12 flex items-center justify-center bg-black/20 backdrop-blur-xl rounded-2xl text-white pointer-events-auto hover:bg-black/40 transition-all duration-300 shadow-xl border border-white/10"
        >
          <i class='bx bx-chevron-left text-3xl'></i>
        </button>
        <div class="flex gap-3 pointer-events-auto">
          <button class="w-12 h-12 flex items-center justify-center bg-black/20 backdrop-blur-xl rounded-2xl text-white hover:bg-black/40 transition-all duration-300 shadow-xl border border-white/10">
            <i class='bx bx-share-alt text-2xl'></i>
          </button>
          <button class="w-12 h-12 flex items-center justify-center bg-black/20 backdrop-blur-xl rounded-2xl text-white hover:bg-black/40 transition-all duration-300 shadow-xl border border-white/10">
            <i class='bx bx-dots-vertical-rounded text-2xl'></i>
          </button>
        </div>
      </div>

      <!-- Hero Gallery -->
      <div class="relative w-full h-[55vh] lg:h-[75vh] overflow-hidden bg-brand-forest-dark">
        <swiper
          :modules="modules"
          :slides-per-view="1.2"
          :centered-slides="true"
          :space-between="20"
          :loop="true"
          :initial-slide="0"
          :pagination="{ clickable: true }"
          :breakpoints="{
            '1024': {
              slidesPerView: 1.2,
              centeredSlides: true,
              spaceBetween: 40
            }
          }"
          class="w-full h-full product-gallery-swiper"
        >
          <swiper-slide v-for="(img, index) in productImages" :key="index" class="relative group overflow-hidden">
            <img :src="img" :alt="product.name" class="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
            <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
          </swiper-slide>
        </swiper>
      </div>

      <!-- Main Content Container (Overlapping) -->
      <div class="relative -mt-16 bg-white rounded-t-[50px] px-8 pt-12 pb-6 z-10 min-h-[50vh] animate-fade-up">
        <!-- Floating Action Button 'Heart' -->
        <button 
          @click="toggleFavorite"
          class="absolute -top-8 right-10 w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:scale-110 transition-all duration-500 group border border-gray-100"
        >
          <i 
            class='bx transition-all duration-500 text-3xl' 
            :class="isFavorite ? 'bxs-heart text-brand-terracotta scale-110' : 'bx-heart text-gray-400 group-hover:text-brand-terracotta'"
          ></i>
        </button>

        <!-- Header Info -->
        <div class="mb-10">
          <div class="flex items-center gap-2 mb-4">
            <span class="bg-brand-terracotta/10 text-brand-terracotta px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Best Seller</span>
            <span class="bg-brand-maroon/10 text-brand-maroon px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Recommended</span>
          </div>
          <h1 class="text-3xl font-extrabold text-brand-forest-dark mb-4 leading-tight tracking-tight lg:text-3xl">{{ product.name }}</h1>
          <div class="flex items-center gap-3">
            <div class="flex text-orange-400">
              <i v-for="i in 5" :key="i" class='bx bxs-star text-lg'></i>
            </div>
            <span class="text-gray-500 font-medium text-sm">
              <span class="text-brand-forest-dark font-bold text-base">{{ product.rating }}</span>
              <span class="mx-1.5">/</span>
              <span>({{ product.reviews }} reviews)</span>
            </span>
          </div>
        </div>

        <!-- Price Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6 lg:mb-12">
          <div>
            <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">Mulai Dari</p>
            <span class="text-brand-maroon text-2xl lg:text-3xl font-black tracking-tighter flex items-baseline gap-1.5">
              <span class="text-xl font-extrabold">Rp</span>
              {{ formatPriceValue(product.price) }}
            </span>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right hidden md:block">
              <p class="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1.5">Status Produk</p>
              <span class="text-green-600 font-bold text-base flex items-center gap-2 justify-end">
                <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-200"></span>
                Tersedia Sekarang
              </span>
            </div>
          </div>
        </div>

        <!-- Highlight Panel -->
        <div class="grid grid-cols-3 gap-4 mb-12 lg:gap-8">
          <div class="flex flex-col items-center text-center p-4 lg:p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:border-brand-terracotta/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-brand-terracotta/5">
            <div class="w-14 h-14 lg:w-20 lg:h-20 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <i class='bx bx-package text-brand-terracotta text-3xl lg:text-4xl'></i>
            </div>
            <span class="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1.5">Min. Order</span>
            <span class="text-sm lg:text-lg font-extrabold text-brand-forest-dark">{{ product.minOrder }} Porsi</span>
          </div>
          <div class="flex flex-col items-center text-center p-4 lg:p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:border-brand-maroon/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-brand-maroon/5">
            <div class="w-14 h-14 lg:w-20 lg:h-20 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <i class='bx bx-calendar-check text-brand-maroon text-3xl lg:text-4xl'></i>
            </div>
            <span class="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1.5">Pre-Order</span>
            <span class="text-sm lg:text-lg font-extrabold text-brand-forest-dark">{{ product.preOrder }} Hari</span>
          </div>
          <div class="flex flex-col items-center text-center p-4 lg:p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:border-green-600/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-green-600/5">
            <div class="w-14 h-14 lg:w-20 lg:h-20 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <i class='bx bx-leaf text-green-600 text-3xl lg:text-4xl'></i>
            </div>
            <span class="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1.5">100% Fresh</span>
            <span class="text-sm lg:text-lg font-extrabold text-brand-forest-dark">Sajian Baru</span>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-14 animate-fade-up-delay">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-1.5 h-8 bg-brand-maroon rounded-full"></div>
            <h3 class="text-xl font-extrabold text-brand-forest-dark tracking-tight lg:text-2xl">Deskripsi Produk</h3>
          </div>
          <p class="text-gray-500 leading-relaxed text-base lg:text-md lg:max-w-4xl">
            {{ product.description }}
          </p>
        </div>

        <!-- Similar Items -->
        <div class="mb-10 animate-fade-up-delay">
          <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
              <div class="w-1.5 h-8 bg-brand-terracotta rounded-full"></div>
              <h3 class="text-xl font-extrabold text-brand-forest-dark tracking-tight lg:text-2xl">Produk Serupa</h3>
            </div>
            <button v-if="similarProducts.length > 0" class="text-brand-maroon font-bold text-sm hover:underline tracking-widest uppercase lg:text-base">Lihat Semua</button>
          </div>
          
          <div v-if="similarProducts.length === 0 && !loading" class="bg-gray-50 rounded-[40px] p-12 text-center border border-dashed border-gray-200">
            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <i class='bx bx-package text-gray-300 text-3xl'></i>
            </div>
            <p class="text-gray-400 font-medium tracking-wide">Belum ada produk serupa yang tersedia untuk saat ini.</p>
          </div>

          <swiper
            v-else
            :slides-per-view="2.2"
            :space-between="24"
            :breakpoints="{
              '1024': {
                slidesPerView: 4.5,
                spaceBetween: 32
              }
            }"
            class="w-full pb-10"
          >
            <swiper-slide v-for="item in similarProducts" :key="item.id">
              <div 
                @click="router.push(`/produk/${item.slug}`)"
                class="bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group cursor-pointer h-full pb-3"
              >
                <div class="aspect-4/5 overflow-hidden relative">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div class="absolute top-4 right-4">
                    <button class="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                      <i class='bx bx-heart text-brand-maroon text-base'></i>
                    </button>
                  </div>
                </div>
                <div class="p-5 text-center">
                  <h4 class="font-bold text-brand-forest-dark text-base truncate mb-2 group-hover:text-brand-maroon transition-colors">{{ item.name }}</h4>
                  <p class="text-brand-maroon font-extrabold text-sm lg:text-base">{{ formatPrice(item.price) }}</p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>

    <!-- Fixed Bottom CTA Bar (Modern & Elegant) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl lg:max-w-4xl z-100 px-6 pb-8 pointer-events-none">
      <div class="bg-brand-forest-dark/95 backdrop-blur-2xl rounded-[32px] p-3 md:p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 pointer-events-auto animate-fade-up">
        
        <!-- Product Quick Info -->
        <div class="flex flex-col pl-4 md:pl-6 overflow-hidden">
          <p class="text-white/50 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-1">
            {{ product.name }}
          </p>
          <div class="flex items-baseline gap-1.5">
            <span class="text-brand-terracotta text-xs font-black">Rp</span>
            <span class="text-white text-xl md:text-2xl font-black tracking-tight leading-none">
              {{ formatPriceValue(product.price) }}
            </span>
          </div>
        </div>
        
        <!-- Primary Action -->
        <button class="bg-brand-terracotta hover:bg-brand-terracotta/90 text-white font-black px-6 md:px-10 py-4 md:py-5 rounded-[24px] shadow-xl shadow-brand-terracotta/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-3 group">
          <span class="uppercase tracking-widest text-[10px] md:text-xs">Pesan Sekarang</span>
          <div class="hidden md:flex w-8 h-8 bg-white/20 rounded-xl items-center justify-center group-hover:bg-white/30 transition-colors">
            <i class='bx bx-right-arrow-alt text-xl'></i>
          </div>
        </button>
      </div>
    </div>

    <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import api from '../utils/axios'
import Footer from '../components/common/Footer.vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

const route = useRoute()
const router = useRouter()
const modules = [Pagination]

const isFavorite = ref(false)
const loading = ref(true)

const product = ref({
  name: 'Memuat...',
  rating: 4.8,
  reviews: 124,
  price: 0,
  minOrder: 1,
  preOrder: 1,
  description: '',
})

const productImages = ref([])
const similarProducts = ref([])

const fetchProductDetail = async () => {
  loading.value = true
  try {
    const slug = route.params.slug
    const response = await api.get(`/catalog/sub-products/${slug}`)
    
    if (response.data.success) {
      const data = response.data.data
      
      product.value = {
        name: data.name,
        rating: 4.9, // Default
        reviews: 312, // Default
        price: data.price,
        minOrder: data.min_order || 20,
        preOrder: 1, // Default or find in data
        description: data.description || 'Tidak ada deskripsi.',
      }
      
      // Gallery mapping
      if (data.galleries && data.galleries.length > 0) {
        productImages.value = data.galleries.map(g => g.image_url)
      } else {
        // Fallback to placeholder if no galleries
        productImages.value = ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop']
      }
      
      // Related products mapping
      if (data.related_sub_products && data.related_sub_products.length > 0) {
        similarProducts.value = data.related_sub_products.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.galleries?.[0]?.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop'
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

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// Watch for slug changes to refresh data
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
/* Swiper Customization (Hero Gallery) */
:deep(.product-gallery-swiper .swiper-pagination) {
  bottom: 80px !important;
  z-index: 50;
}
:deep(.product-gallery-swiper .swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: white;
  opacity: 0.4;
  margin: 0 6px !important;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
:deep(.product-gallery-swiper .swiper-pagination-bullet-active) {
  width: 40px;
  background: white !important;
  opacity: 1;
  border-radius: 20px;
}

/* Animations from style.css integration */
.animate-fade-up {
  animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.animate-fade-up-delay {
  animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #fcfcfc;
}
::-webkit-scrollbar-thumb {
  background: #E07A5F;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: #690B22;
}
</style>
