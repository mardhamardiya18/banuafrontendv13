<template>
  <div class="min-h-screen bg-[#F9FAFB] font-sans text-brand-forest-dark pb-20">
    <TopNav :showMenu="false" />

    <main class="max-w-3xl mx-auto px-4 pt-28 lg:pt-32">
      <!-- STEP INDICATOR -->
      <div class="mb-12">
        <div class="flex items-center justify-center gap-4">
          <div v-for="step in 3" :key="step" class="flex items-center">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 shadow-lg"
              :class="currentStep >= step ? 'bg-brand-maroon text-white shadow-brand-maroon/20' : 'bg-white text-gray-300 border border-gray-100'"
            >
              {{ step }}
            </div>
            <div v-if="step < 3" class="w-12 h-1 bg-gray-100 mx-2 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand-maroon transition-all duration-700 ease-out"
                :style="{ width: currentStep > step ? '100%' : '0%' }"
              ></div>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-14 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <span :class="{ 'text-brand-maroon': currentStep === 1 }">Pelanggan</span>
          <span :class="{ 'text-brand-maroon': currentStep === 2 }">Pesanan</span>
          <span :class="{ 'text-brand-maroon': currentStep === 3 }">Checkout</span>
        </div>
      </div>

      <!-- STEP 1: INFORMASI PELANGGAN -->
      <section v-if="currentStep === 1" class="animate-fade-up">
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 overflow-hidden">
          <div class="p-8 border-b border-gray-50">
            <h2 class="text-xl font-black text-brand-maroon uppercase tracking-tight">Data Pengiriman</h2>
            <p class="text-xs text-gray-400 font-medium mt-1">Lengkapi informasi lokasi dan waktu pengiriman</p>
          </div>

          <div class="p-8 space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input v-model="customerInfo.name" type="text" placeholder="Nama Anda" class="form-input" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">No. Telepon (WhatsApp)</label>
                <input v-model="customerInfo.phone" type="tel" placeholder="08xxxxxx" class="form-input" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
              <textarea v-model="customerInfo.address" rows="3" placeholder="Alamat detail..." class="form-input resize-none"></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link Google Maps (Opsional)</label>
                <input v-model="customerInfo.linkMaps" type="text" placeholder="https://goo.gl/maps/..." class="form-input" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jadwal Pengiriman</label>
                <input v-model="customerInfo.deliveryDateTime" type="datetime-local" class="form-input" />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipe Pengiriman</label>
                <select v-model="customerInfo.deliveryType" class="form-input">
                  <option value="delivery">Kirim ke Alamat (Delivery)</option>
                  <option value="pickup">Ambil Sendiri (Pickup)</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catatan Pengiriman</label>
                <input v-model="customerInfo.note" type="text" placeholder="Catatan untuk kurir" class="form-input" />
              </div>
            </div>

            <div class="pt-6">
              <button @click="currentStep = 2" class="btn-primary w-full py-6">
                Lanjut Pilih Produk <i class='bx bx-right-arrow-alt text-xl'></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 2: ITEM PESANAN -->
      <section v-if="currentStep === 2" class="animate-fade-up space-y-8">
        <div v-for="(item, index) in orderItems" :key="index" class="bg-white rounded-[2.5rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 overflow-hidden">
          <div class="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <span class="text-[10px] font-black text-brand-maroon uppercase tracking-[0.3em]">Paket #{{ index + 1 }}</span>
            <button v-if="orderItems.length > 1" @click="removeItem(index)" class="text-red-400 hover:text-red-600 transition-colors">
              <i class='bx bx-trash-alt text-xl'></i>
            </button>
          </div>

          <div class="p-8 space-y-8">
            <div class="grid md:grid-cols-12 gap-6 items-start">
              <div class="md:col-span-6 space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Paket</label>
                <select v-model="item.subProdukId" @change="updateItemPrice(index)" class="form-input">
                  <option disabled value="">Pilih Sub Produk...</option>
                  <option v-for="sp in availableSubProducts" :key="sp.id" :value="sp.id">
                    {{ sp.name }} ({{ formatPrice(sp.price) }})
                  </option>
                </select>
              </div>
              <div class="md:col-span-3 space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jumlah (Porsi)</label>
                <input v-model.number="item.jumlah" type="number" min="1" class="form-input" />
              </div>
              <div class="md:col-span-3 text-right">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subtotal</p>
                <p class="text-lg font-black text-brand-maroon tracking-tighter">{{ formatPrice(item.jumlah * item.harga) }}</p>
              </div>
            </div>

            <!-- MENU SELECTION -->
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Pilihan Lauk / Menu (Pilih yang diinginkan)</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="m in dummyMenus" 
                  :key="m" 
                  @click="toggleMenu(index, m)"
                  type="button"
                  :class="item.pilihanMenu.includes(m) ? 'bg-brand-maroon text-white border-brand-maroon' : 'bg-white text-gray-500 border-gray-100 hover:border-brand-maroon/20'"
                  class="px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-300"
                >
                  {{ m }}
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catatan Khusus Paket</label>
              <input v-model="item.catatanItem" type="text" placeholder="Misal: Tanpa sambal, dll" class="form-input" />
            </div>
          </div>
        </div>

        <button @click="addItem" class="w-full py-4 border-2 border-dashed border-brand-maroon/20 rounded-[2rem] text-brand-maroon font-black text-xs uppercase tracking-widest hover:bg-brand-maroon/5 transition-all">
          <i class='bx bx-plus-circle text-xl mr-2'></i> Tambah Paket Lain
        </button>

        <div class="grid grid-cols-2 gap-4">
          <button @click="currentStep = 1" class="py-6 border border-gray-200 rounded-[2rem] text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
            Kembali
          </button>
          <button @click="currentStep = 3" class="btn-primary py-6">
            Lanjut ke Ringkasan <i class='bx bx-check-double text-xl'></i>
          </button>
        </div>
      </section>

      <!-- STEP 3: RINGKASAN & CHECKOUT -->
      <section v-if="currentStep === 3" class="animate-fade-up space-y-8">
        <!-- CUSTOMER INFO SUMMARY -->
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-sm font-black text-brand-maroon uppercase tracking-widest">Data Pengiriman</h2>
            <button @click="currentStep = 1" class="text-[10px] font-black text-brand-terracotta uppercase tracking-widest underline">Edit</button>
          </div>
          <div class="grid sm:grid-cols-2 gap-6 text-sm">
            <div class="space-y-1">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Penerima</p>
              <p class="font-black text-brand-forest-dark">{{ customerInfo.name }} ({{ customerInfo.phone }})</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Jadwal</p>
              <p class="font-black text-brand-forest-dark">{{ formatDate(customerInfo.deliveryDateTime) }}</p>
            </div>
            <div class="sm:col-span-2 space-y-1">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Alamat</p>
              <p class="font-black text-brand-forest-dark leading-relaxed">{{ customerInfo.address }}</p>
            </div>
          </div>
        </div>

        <!-- ITEMS SUMMARY -->
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 overflow-hidden">
          <div class="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-sm font-black text-brand-maroon uppercase tracking-widest">Rincian Pesanan</h2>
            <button @click="currentStep = 2" class="text-[10px] font-black text-brand-terracotta uppercase tracking-widest underline">Edit</button>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="(item, idx) in orderItems" :key="idx" class="flex justify-between items-start border-b border-gray-50 pb-6 last:border-0 last:pb-0">
              <div class="space-y-2">
                <p class="font-black text-brand-forest-dark uppercase tracking-tight">{{ getSubProductName(item.subProdukId) }}</p>
                <p class="text-xs text-gray-400 font-bold">{{ item.jumlah }} Porsi x {{ formatPrice(item.harga) }}</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="m in item.pilihanMenu" :key="m" class="text-[9px] font-bold bg-gray-50 px-2 py-1 rounded text-gray-500 uppercase">{{ m }}</span>
                </div>
              </div>
              <p class="font-black text-brand-maroon tracking-tighter">{{ formatPrice(item.jumlah * item.harga) }}</p>
            </div>

            <div class="pt-6 border-t border-brand-maroon/10 flex justify-between items-center">
              <span class="text-sm font-black text-brand-forest-dark uppercase tracking-widest">Total Bayar</span>
              <span class="text-2xl font-black text-brand-maroon tracking-tighter">{{ formatPrice(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button @click="currentStep = 2" class="py-6 border border-gray-200 rounded-[2rem] text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
            Kembali
          </button>
          <button @click="handleCheckout" :disabled="loading" class="btn-primary py-6 flex items-center justify-center gap-3">
            <span v-if="!loading">Konfirmasi & Buat Pesanan</span>
            <span v-else class="flex items-center gap-2"><i class='bx bx-loader-alt animate-spin text-xl'></i> Memproses...</span>
          </button>
        </div>
      </section>
    </main>

    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/axios'
import TopNav from '../components/catalog/TopNav.vue'
import BottomNav from '../components/catalog/BottomNav.vue'
import Footer from '../components/catalog/Footer.vue'

const router = useRouter()
const loading = ref(false)
const currentStep = ref(1)

const dummyMenus = ['Nasi Putih', 'Nasi Kuning Banua', 'Ayam Bakar Madu', 'Rendang', 'Es Buah', 'Sambal Goreng Ati', 'Telur Balado', 'Urap Sayur']

const availableSubProducts = ref([])

// State Management
const customerInfo = reactive({
  name: '',
  phone: '',
  address: '',
  linkMaps: '',
  deliveryDateTime: '',
  deliveryType: 'delivery',
  note: ''
})

const orderItems = ref([
  { subProdukId: '', jumlah: 20, harga: 0, catatanItem: '', pilihanMenu: [] }
])

// Load from LocalStorage
onMounted(async () => {
  const savedState = localStorage.getItem('checkout_wizard_state')
  if (savedState) {
    const data = JSON.parse(savedState)
    Object.assign(customerInfo, data.customerInfo)
    orderItems.value = data.orderItems
    currentStep.value = data.currentStep || 1
  }

  // Fetch available subproducts for the dropdown
  try {
    const response = await api.get('/catalog/sub-products')
    if (response.data.success) {
      availableSubProducts.value = response.data.data
    }
  } catch (err) {
    console.error('Failed to fetch packages', err)
  }
})

// Sync to LocalStorage
watch([currentStep, customerInfo, orderItems], () => {
  localStorage.setItem('checkout_wizard_state', JSON.stringify({
    currentStep: currentStep.value,
    customerInfo,
    orderItems: orderItems.value
  }))
}, { deep: true })

const addItem = () => {
  orderItems.value.push({ subProdukId: '', jumlah: 20, harga: 0, catatanItem: '', pilihanMenu: [] })
}

const removeItem = (index) => {
  orderItems.value.splice(index, 1)
}

const toggleMenu = (itemIdx, menuName) => {
  const menus = orderItems.value[itemIdx].pilihanMenu
  const idx = menus.indexOf(menuName)
  if (idx > -1) menus.splice(idx, 1)
  else menus.push(menuName)
}

const updateItemPrice = (index) => {
  const selected = availableSubProducts.value.find(sp => sp.id === orderItems.value[index].subProdukId)
  if (selected) {
    orderItems.value[index].harga = selected.price
  }
}

const getSubProductName = (id) => {
  return availableSubProducts.value.find(sp => sp.id === id)?.name || 'Paket Menu'
}

const grandTotal = computed(() => {
  return orderItems.value.reduce((acc, item) => acc + (item.jumlah * item.harga), 0)
})

const formatPrice = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)
const formatDate = (v) => v ? new Date(v).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) : '-'

const handleCheckout = async () => {
  loading.value = true
  try {
    const payload = {
      customer: customerInfo,
      items: orderItems.value,
      total: grandTotal.value
    }
    const res = await api.post('/orders', payload)
    if (res.data.success) {
      localStorage.removeItem('checkout_wizard_state')
      alert('Pesanan Berhasil Dibuat!')
      router.push('/')
    }
  } catch (err) {
    alert('Terjadi kesalahan saat membuat pesanan.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@reference "../style.css";

.form-input {
  @apply w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-forest-dark outline-none focus:bg-white focus:border-brand-maroon/20 focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300;
}

.btn-primary {
  @apply relative overflow-hidden bg-brand-maroon text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-brand-maroon/20 hover:shadow-brand-maroon/40 hover:-translate-y-1 active:scale-95 transition-all duration-500;
}

.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
