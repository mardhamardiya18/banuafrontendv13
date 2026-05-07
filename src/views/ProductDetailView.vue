<template>
  <div class="min-h-screen bg-[#FDFBF7] font-sans text-brand-forest-dark selection:bg-brand-terracotta/20 pb-24">
    
    <!-- Top Navigation (Consistent with Catalog) -->
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
      <div class="mb-10 lg:mb-16  flex flex-col md:flex-row md:items-center justify-between gap-6 ">
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
        
        <!-- LEFT COLUMN: Gallery & Description (8/12) -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-5 lg:space-y-24">
          
          <!-- Gallery Slider (Portrait Centered) -->
          <div class="relative -mx-4 sm:mx-0">
            <swiper
              :modules="modules"
              :slides-per-view="'auto'"
              :centered-slides="true"
              :space-between="20"
              :pagination="{ clickable: true }"
              class="product-detail-swiper !pb-14"
            >
              <swiper-slide v-for="(img, index) in productImages" :key="index" class="!w-[85%] sm:!w-[70%]">
                <div class="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-maroon/5 border border-white">
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
            <p class="text-gray-500 leading-[1.8] text-lg font-medium whitespace-pre-line">
              {{ product.description }}
            </p>
          </div>
        </div>

        <!-- RIGHT COLUMN: Sidebar Info (4/12) -->
        <div class="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-12">
          <div class="bg-white rounded-[3rem] p-8 lg:p-12 shadow-[0_30px_100px_rgba(105,11,34,0.06)] border border-brand-maroon/5 space-y-10">
            
            <!-- Tags & Badge -->
            <div class="flex flex-wrap gap-2">
              <span class="bg-brand-terracotta/10 text-brand-terracotta text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                Best Seller
              </span>
              <span class="bg-brand-maroon/5 text-brand-maroon text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                Catering Banua
              </span>
            </div>

            <!-- Title & Rating -->
            <div class="space-y-4">
              <h1 class="text-4xl font-black text-brand-maroon leading-[1.1] tracking-tight">
                {{ product.name }}
              </h1>
              <div class="flex items-center gap-4">
                <div class="flex text-orange-400 gap-0.5">
                  <i v-for="i in 5" :key="i" class='bx bxs-star text-lg'></i>
                </div>
                <div class="h-4 w-px bg-gray-200"></div>
                <p class="text-sm font-bold text-gray-400">
                  <span class="text-brand-forest-dark">{{ product.rating }}</span> ({{ product.reviews }} reviews)
                </p>
              </div>
            </div>

            <!-- Price Card -->
            <div class="p-8 bg-brand-cream-light/30 rounded-[2rem] border border-brand-cream-light/50">
              <p class="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3">Harga Mulai Dari</p>
              <div class="flex items-baseline gap-2">
                <span class="text-brand-terracotta font-black text-xl italic">Rp</span>
                <span class="text-4xl font-black text-brand-maroon tracking-tighter">
                  {{ formatPriceValue(product.price) }}
                </span>
              </div>
            </div>

            <!-- Highlight Points -->
            <div class="grid grid-cols-1 gap-6 ">
              <div class="flex items-center gap-5 group">
                <div class="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-brand-maroon/5 flex items-center justify-center text-brand-terracotta border border-gray-50 transition-all duration-500 group-hover:scale-110">
                  <i class='bx bx-package text-2xl'></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Min. Order</p>
                  <p class="font-extrabold text-brand-forest-dark">{{ product.minOrder }} Porsi</p>
                </div>
              </div>

              <div class="flex items-center gap-5 group">
                <div class="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-brand-maroon/5 flex items-center justify-center text-brand-maroon border border-gray-50 transition-all duration-500 group-hover:scale-110">
                  <i class='bx bx-calendar-check text-2xl'></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Waktu Tunggu</p>
                  <p class="font-extrabold text-brand-forest-dark">PO {{ product.preOrder }} Hari</p>
                </div>
              </div>

              <div class="flex items-center gap-5 group">
                <div class="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-brand-maroon/5 flex items-center justify-center text-green-600 border border-gray-50 transition-all duration-500 group-hover:scale-110">
                  <i class='bx bx-leaf text-2xl'></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Kualitas</p>
                  <p class="font-extrabold text-brand-forest-dark">100% Fresh & Higienis</p>
                </div>
              </div>
            </div>

            <!-- CTA Action -->
            <div class="pt-6">
              <button class="w-full bg-brand-maroon hover:bg-brand-terracotta text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-brand-maroon/20 transition-all duration-500 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4 group">
                <span class="uppercase tracking-[0.2em] text-xs">Pesan Sekarang</span>
                <i class='bx bx-right-arrow-alt text-2xl group-hover:translate-x-2 transition-transform'></i>
              </button>
              <p class="text-center mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">* Harga sewaktu-waktu dapat berubah</p>
            </div>
          </div>
        </div>
      </div>

      <!-- SIMILAR PRODUCTS SECTION -->
      <div class="mt-24 lg:mt-48 space-y-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-2">
            <span class="text-brand-terracotta text-[10px] font-black uppercase tracking-[0.3em]">Rekomendasi</span>
            <h3 class="text-3xl lg:text-4xl font-black text-brand-maroon tracking-tight">Produk Serupa</h3>
          </div>
          <button v-if="similarProducts.length > 0" class="group flex items-center gap-3 text-brand-maroon font-black text-xs uppercase tracking-widest hover:text-brand-terracotta transition-colors">
            Lihat Semua Katalog
            <i class='bx bx-right-top-arrow-circle text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'></i>
          </button>
        </div>

        <div v-if="similarProducts.length === 0 && !loading" class="bg-white rounded-[3rem] p-16 text-center border border-dashed border-gray-200">
          <div class="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i class='bx bx-package text-gray-300 text-4xl'></i>
          </div>
          <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">Belum ada produk serupa</p>
        </div>

        <swiper
          v-else
          :slides-per-view="'auto'"
          :space-between="24"
          :breakpoints="{
            '1024': {
              slidesPerView: 4,
              spaceBetween: 32
            }
          }"
          class="similar-products-swiper !overflow-visible"
        >
          <swiper-slide v-for="item in similarProducts" :key="item.id" class="!w-[280px] lg:!w-auto">
            <div 
              @click="router.push(`/produk/${item.slug}`)"
              class="group cursor-pointer space-y-6"
            >
              <div class="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-brand-maroon/5 border border-white transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div class="px-2 text-center">
                <h4 class="font-black text-brand-forest-dark text-lg truncate mb-1 group-hover:text-brand-terracotta transition-colors">{{ item.name }}</h4>
                <p class="text-brand-maroon font-black text-sm italic">{{ formatPrice(item.price) }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- FOOTER (Consistent Modular Component) -->
    <Footer />

    <!-- Bottom Navigation (Consistent with Catalog) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import api from '../utils/axios'
import TopNav from '../components/catalog/TopNav.vue'
import BottomNav from '../components/catalog/BottomNav.vue'
import Footer from '../components/catalog/Footer.vue'

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
/* Swiper Customization (Product Detail Gallery) */
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

/* Animations */
.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Glassmorphism utility if needed */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}
</style>
