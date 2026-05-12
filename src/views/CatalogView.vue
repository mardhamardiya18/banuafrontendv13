<template>
  <div class="min-h-screen bg-[#FDFBF7] font-sans">
    <TopNav :showMenu="false" />
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-[100] bg-white/90 backdrop-blur-lg flex flex-col items-center justify-center">
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
        <h2 class="text-3xl font-black text-gray-900 leading-tight tracking-tight">Lapar Hari Ini?<br/>Cari Menu Favoritmu</h2>
      </div>

      <!-- Search & Filter -->
      <SearchBar v-model="searchQuery" />

      <!-- New Banner Section -->
      <div class="px-6 mt-6">
        <div class="relative bg-[#EAF2F5] rounded-[2rem] p-6 md:p-10 overflow-hidden flex items-center min-h-[160px] md:min-h-[220px] shadow-sm border border-white/50 group">
          <div class="relative z-10 w-[60%] md:w-1/2">
            <h3 class="text-lg md:text-3xl font-extrabold text-gray-900 leading-tight mb-1.5 md:mb-3">
              Best Healthy <br class="hidden md:block"/> 
              food near you!
            </h3>
            <p class="text-[10px] md:text-sm text-gray-500 font-medium leading-relaxed max-w-[140px] md:max-w-xs mb-4 md:mb-6">
              Nikmati hidangan sehat dan higienis dari Banua Catering.
            </p>
            <button class="px-5 md:px-10 py-2 md:py-3.5 bg-linear-to-r from-orange-400 to-orange-500 text-white text-[11px] md:text-sm font-bold rounded-xl md:rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95">
              Explore
            </button>
          </div>
          
          <div class="absolute right-0 top-0 bottom-0 w-[50%] md:w-[45%] flex items-center justify-end pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" 
              alt="Healthy Food" 
              class="h-full w-full object-cover object-center transform scale-110 group-hover:scale-115 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-linear-to-r from-[#EAF2F5] via-[#EAF2F5]/40 to-transparent"></div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <CategoryList :categories="categories" v-model="selectedCategory" />

      <!-- Product Grid -->
      <div v-if="!loading && filteredProducts.length > 0" class="px-6 mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else-if="!loading" class="px-6 mt-20 text-center pb-20">
        <i class="bx bx-dish text-6xl text-gray-200 mb-4"></i>
        <p class="text-gray-400 font-medium">Wah, menu yang kamu cari belum tersedia.</p>
      </div>

    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import catalogApi from '../api/catalogApi'
import TopNav from '../components/catalog/TopNav.vue'
import SearchBar from '../components/catalog/SearchBar.vue'
import CategoryList from '../components/catalog/CategoryList.vue'
import ProductCard from '../components/catalog/ProductCard.vue'
import Footer from '../components/catalog/Footer.vue'

const categories = ref([{ id: 'all', name: 'Semua Menu' }])
const products = ref([])
const selectedCategory = ref('all')
const searchQuery = ref('')
const loading = ref(true)

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
    // Pass category slug if not 'all'
    const categorySlug = selectedCategory.value === 'all' ? null : selectedCategory.value
    const res = await catalogApi.getProducts(categorySlug)
    
    if (res.success) {
      products.value = res.data.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        rating: 4.8, 
        categoryName: p.category?.name || 'Produk',
        img: p.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        categoryId: p.category_id,
        categorySlug: p.category?.slug
      }))
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Filtering by category ID if selected
    const matchesCategory = selectedCategory.value === 'all' || p.categoryId === selectedCategory.value
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

// Watch for category selection changes to fetch filtered products from server
watch(selectedCategory, () => {
  fetchProducts()
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>
