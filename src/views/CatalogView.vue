<template>
  <div class="min-h-screen bg-paper font-sans">
    <TopNav :showMenu="false" />
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-100 bg-white/90 backdrop-blur-lg flex flex-col items-center justify-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-brand-terracotta/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-brand-terracotta rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-brand-maroon font-bold tracking-widest uppercase text-xs animate-pulse">Menyiapkan Hidangan...</p>
    </div>
    
    <main class="max-w-7xl mx-auto md:px-6 pt-24">
      <!-- Greeting Section -->
      <div class="px-6 mt-8 mb-2">
        <p class="text-lg font-medium text-gray-500">Halo!</p>
        <h2 class="text-3xl font-black text-gray-900 leading-tight tracking-tight">Ada Acara Spesial?<br/>Temukan Menu Favoritmu</h2>
      </div>



      <!-- New Banner Section -->
      <div class="px-6 mt-6">
        <div class="relative bg-gray-900 rounded-4xl p-6 md:p-10 overflow-hidden flex items-center min-h-40 md:min-h-56 shadow-xl border border-white/10 group">
          <div class="relative z-10 w-3/5 md:w-1/2">
            <h3 class="text-lg md:text-3xl font-extrabold text-white leading-tight mb-1.5 md:mb-3">
              Sajian Istimewa <br class="hidden md:block"/> 
              Untuk Acaramu!
            </h3>
            <p class="text-[10px] md:text-sm text-gray-300 font-medium leading-relaxed max-w-36 md:max-w-xs mb-4 md:mb-6">
              Nikmati aneka tumpeng, nasi kotak, dan catering dengan cita rasa juara dari DMI Catering.
            </p>
            <a href="https://wa.me/6285156253408?text=Halo%20Min!%20Liat%20banner%20promo%20di%20katalog%20nih,%20boleh%20minta%20info%20promonya%3F" target="_blank" class="inline-block px-5 md:px-10 py-2 md:py-3.5 bg-linear-to-r from-brand-terracotta to-brand-maroon text-white text-[11px] md:text-sm font-bold rounded-xl md:rounded-2xl shadow-lg shadow-brand-terracotta/30 hover:-translate-y-0.5 transition-all active:scale-95">
              Lihat Promo
            </a>
          </div>
          
          <div class="absolute inset-0 pointer-events-none">
            <img 
              :src="bannerImg" 
              alt="Promo Banner DMI Catering" 
              loading="lazy"
              decoding="async"
              width="800"
              height="400"
              class="h-full w-full object-cover object-right md:object-center transform scale-105 group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-linear-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
          </div>
        </div>
      </div>

      <RecommendedProducts v-if="!loading && recommendedProducts.length" :products="recommendedProducts" />
      <section class="mt-12 pb-20" aria-labelledby="all-menu-title">
        <header class="px-6 flex flex-wrap items-end justify-between gap-3">
          <div><p class="text-[10px] font-bold tracking-widest uppercase text-brand-terracotta mb-2">Pilihan untuk setiap acara</p><h2 id="all-menu-title" class="text-2xl md:text-3xl font-extrabold text-brand-maroon">Jelajahi semua menu</h2><p class="text-sm text-gray-500 mt-2">Temukan sajian yang pas untuk momenmu.</p></div>
          <p v-if="!loading" class="text-xs text-gray-500">{{ filteredProducts.length }} menu tersedia</p>
        </header>
        <SearchBar v-model="searchQuery" />
        <CategoryList :categories="categories" v-model="selectedCategory" />
        <div v-if="errorMessage" class="mx-6 mt-6 p-8 rounded-3xl bg-white text-center" role="alert"><p>{{ errorMessage }}</p><button @click="fetchProducts" class="mt-4 px-5 py-3 rounded-full bg-brand-maroon text-white">Coba lagi</button></div>
        <div v-else-if="!loading && filteredProducts.length" class="px-6 mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"><ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" /></div>
        <div v-else-if="!loading" class="mx-6 mt-6 py-14 px-5 text-center rounded-3xl border border-dashed border-brand-maroon/15"><p class="font-bold text-brand-maroon">Belum ada menu yang cocok</p><p class="mt-2 text-sm text-gray-500">Coba kata kunci lain atau pilih kategori berbeda.</p><button @click="searchQuery = ''; selectedCategory = 'all'" class="mt-5 min-h-11 px-5 rounded-full bg-brand-maroon text-white text-sm">Lihat semua menu</button></div>
      </section>

    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import catalogApi from '../api/catalogApi'
import TopNav from '../components/catalog/TopNav.vue'
import SearchBar from '../components/catalog/SearchBar.vue'
import CategoryList from '../components/catalog/CategoryList.vue'
import ProductCard from '../components/catalog/ProductCard.vue'
import RecommendedProducts from '../components/catalog/RecommendedProducts.vue'
import Footer from '../components/catalog/Footer.vue'
import bannerImg from "../assets/images/banner.jpg"

const categories = ref([{ id: 'all', name: 'Semua Menu' }])
const route = useRoute()
const products = ref([])
const selectedCategory = ref('all')
const searchQuery = ref('')
const loading = ref(true)
const errorMessage = ref('')
const recommendedProducts = computed(() => products.value.filter(p => p.isRecommended))

const fetchCategories = async () => {
  try {
    const res = await catalogApi.getCategories()
    if (res.success) {
      categories.value = [
        { id: 'all', name: 'Semua Menu' },
        ...res.data
      ]
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    errorMessage.value = ''
    const res = await catalogApi.getProducts()
    if (!res.success) throw new Error(res.message)
    
    if (res.success) {
      products.value = res.data.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        isRecommended: [true, 1, '1', 'true'].includes(p.is_recommended),
        minOrder: Number(p.min_order) || null,
        discount: Number(p.discount) || 0,
        categoryName: p.category?.name || 'Produk',
        img: p.thumbnail || null,
        categoryId: p.category_id,
        categorySlug: p.category?.slug
      }))
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    errorMessage.value = 'Menu belum berhasil dimuat. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Filtering by category ID if selected
    const matchesCategory = selectedCategory.value === 'all' || String(p.categoryId) === String(selectedCategory.value)
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const applyRouteCategory = () => {
  const q = String(route.query.category || '').toLowerCase()
  const found = categories.value.find(c => c.slug?.toLowerCase() === q || (q && c.name.toLowerCase().includes(q)) || (q === 'nasi-kotak' && c.name.toLowerCase().includes('kotak')))
  selectedCategory.value = found?.id ?? 'all'
}
watch(() => route.query.category, applyRouteCategory)
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts()])
  applyRouteCategory()
})
</script>
