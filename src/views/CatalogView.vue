<template>
  <div class="min-h-screen bg-[#FDFBF7] font-sans pb-32">
    <TopNav />
    
    <main class="max-w-7xl mx-auto md:px-6">
      <!-- Greeting & Desktop Banner Section -->
      <div class="px-6 mt-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="shrink-0">
          <p class="text-base font-semibold text-brand-terracotta tracking-wide">Selamat Datang di DMI Catering</p>
          <h2 class="text-4xl font-black text-gray-900 leading-[1.15] mt-1.5 max-w-[300px] tracking-tight">Temukan Paket Menu Spesial Kami</h2>
        </div>

        <!-- Desktop Banner -->
        <div class="hidden md:flex flex-1 max-w-[600px] ml-auto bg-white rounded-[1.75rem] p-5 relative overflow-hidden group cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1">
          <!-- Abstract bg decoration -->
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-brand-terracotta/10 rounded-full blur-3xl group-hover:bg-brand-terracotta/20 transition-colors duration-500"></div>
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-brand-maroon/5 rounded-full blur-2xl group-hover:bg-brand-maroon/10 transition-colors duration-500"></div>
          
          <div class="flex items-center gap-5 relative z-10 w-full">
            <div class="w-[88px] h-[88px] shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-700 shadow-sm border border-brand-maroon/5">
              <img src="https://placehold.co/200x200/E07A5F/fff?text=Promo" alt="Promo" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <span class="inline-block px-2.5 py-1 bg-brand-terracotta/10 text-brand-terracotta text-[10px] font-bold rounded-md mb-1.5 uppercase tracking-wider">Penawaran Spesial</span>
              <h3 class="text-[17px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-brand-terracotta transition-colors duration-300">Diskon 20% Paket Buffet</h3>
              <p class="text-xs text-gray-400 font-medium leading-relaxed pr-2">Ambil promo ini untuk setiap pemesanan Buffet minimum 100 pax hari ini.</p>
            </div>
            <div class="w-11 h-11 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-terracotta group-hover:text-white transition-all duration-500 shadow-sm border border-brand-maroon/5 group-hover:border-brand-terracotta">
              <i class="bx bx-right-arrow-alt text-2xl group-hover:translate-x-0.5 transition-transform"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filter -->
      <SearchBar v-model="searchQuery" />

      <!-- Categories -->
      <CategoryList :categories="categories" v-model="selectedCategory" />

      <!-- Product Grid -->
      <div v-if="loading" class="px-6 mt-12 flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-terracotta"></div>
      </div>
      
      <div v-else-if="filteredProducts.length > 0" class="px-6 mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="px-6 mt-20 text-center">
        <i class="bx bx-dish text-6xl text-gray-200 mb-4"></i>
        <p class="text-gray-400 font-medium">Wah, menu yang kamu cari belum tersedia.</p>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../utils/axios'
import TopNav from '../components/catalog/TopNav.vue'
import SearchBar from '../components/catalog/SearchBar.vue'
import CategoryList from '../components/catalog/CategoryList.vue'
import ProductCard from '../components/catalog/ProductCard.vue'
import BottomNav from '../components/catalog/BottomNav.vue'

const categories = ref([{ id: 'all', name: 'Semua Menu' }])
const products = ref([])
const selectedCategory = ref('all')
const searchQuery = ref('')
const loading = ref(true)

const fetchCategories = async () => {
  try {
    const response = await api.get('/catalog/categories')
    if (response.data.success) {
      categories.value = [
        { id: 'all', name: 'Semua Menu' },
        ...response.data.data
      ]
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/catalog/products')
    if (response.data.success) {
      // Base URL untuk storage (asumsi Laravel)
      const storageUrl = import.meta.env.VITE_API_URL.replace('/api', '') + '/storage/'
      
      products.value = response.data.data.map(p => ({
        id: p.id,
        name: p.name,
        price: p.start_price,
        rating: 4.8, // Fallback rating jika tidak ada di DB
        time: '30 mnt', // Fallback time jika tidak ada di DB
        img: p.thumbnail ? `${storageUrl}${p.thumbnail}` : 'https://placehold.co/400x400/E07A5F/fff?text=No+Image',
        categoryId: p.category_id
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
    const matchesCategory = selectedCategory.value === 'all' || p.categoryId === selectedCategory.value
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>
