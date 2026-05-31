<template>
  <div class="h-full min-h-[calc(100vh-6rem)] flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <div class="flex items-center gap-4">
        <router-link :to="{ name: 'AdminOrders' }" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
          <i class="bx bx-arrow-back text-xl"></i>
        </router-link>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Point of Sale</h1>
          <p class="text-xs sm:text-sm text-gray-500">Buat pesanan baru secara manual</p>
        </div>
      </div>
      <div class="hidden sm:block text-right">
        <p class="text-sm font-bold text-gray-800">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="flex flex-col lg:flex-row gap-5 flex-1 min-h-0 overflow-hidden">
      
      <!-- LEFT: Product Grid -->
      <div class="flex-[3] flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm min-h-0">
        <!-- Search Header -->
        <div class="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50 shrink-0">
          <div class="relative flex-1">
            <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            <input v-model="searchQuery" type="text" placeholder="Cari menu produk..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-maroon/50 focus:ring-2 focus:ring-brand-maroon/10 transition-all shadow-sm" />
          </div>
        </div>

        <!-- Grid -->
        <div class="flex-1 overflow-y-auto p-4 bg-gray-50/50" @scroll="handleScroll">
          <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
            <i class="bx bx-dish text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-bold text-gray-700">Tidak ada produk</h3>
            <p class="text-sm text-gray-500">Coba kata kunci lain.</p>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-4">
            <div 
              v-for="product in displayedProducts" 
              :key="product.id" 
              @click="addToCart(product)" 
              class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-maroon/40 transition-all cursor-pointer group flex flex-col animate-fade-up"
            >
              <div class="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img loading="lazy" decoding="async" :src="product.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute bottom-2 right-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <div class="bg-brand-maroon text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"><i class="bx bx-plus font-bold"></i></div>
                </div>
              </div>
              <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p class="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-brand-maroon transition-colors">{{ product.name_full }}</p>
                  <p v-if="product.min_order > 1" class="text-[10px] text-amber-600 mt-1 font-semibold">Min: {{ product.min_order }} pcs</p>
                </div>
                <div class="mt-2">
                  <p class="text-brand-maroon font-black text-sm sm:text-base">Rp {{ product.price.toLocaleString('id-ID') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Cart & Checkout -->
      <div class="w-full lg:w-[420px] xl:w-[460px] flex flex-col gap-4 shrink-0 h-full min-h-0">
        
        <!-- Cart List (Scrollable) -->
        <div class="flex-[3] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-[300px]">
          <div class="p-3.5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <h2 class="font-bold text-gray-800 flex items-center gap-2"><i class="bx bx-cart text-brand-maroon"></i> Keranjang</h2>
            <span class="bg-brand-maroon/10 text-brand-maroon px-2 py-0.5 rounded-md text-xs font-bold">{{ totalItemsCount }} item</span>
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-3 relative bg-gray-50/30">
            <div v-if="!form.items.length" class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-50">
              <i class="bx bx-cart-add text-5xl text-gray-300 mb-2"></i>
              <p class="text-sm font-semibold text-gray-500">Keranjang masih kosong</p>
            </div>

            <!-- Cart Items -->
            <div v-for="(item, idx) in form.items" :key="idx" class="bg-white border border-gray-200 rounded-xl p-3 shadow-sm relative group animate-fade-up">
              
              <!-- Top Row: Info & Controls -->
              <div class="flex justify-between items-start gap-2">
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-800 text-sm leading-tight pr-2">{{ getProductName(item.product_id) }}</p>
                  <p class="text-[11px] text-gray-500 mt-0.5 font-medium">Rp {{ getProductPrice(item.product_id).toLocaleString('id-ID') }} / pc</p>
                  <p v-if="getUnderMinOrderFee(item) > 0" class="text-[10px] text-amber-600 font-bold mt-1">+Rp {{ getUnderMinOrderFee(item).toLocaleString('id-ID') }} (Fee Min. Order)</p>
                </div>
                
                <div class="flex flex-col items-end gap-2 shrink-0">
                  <!-- Stepper -->
                  <div class="flex items-center gap-0.5 bg-gray-100 border border-gray-200 rounded-lg p-0.5 h-8">
                    <button @click="item.quantity > 1 ? item.quantity-- : removeItem(idx)" class="w-7 h-full rounded-md bg-white shadow-sm flex items-center justify-center hover:text-brand-maroon text-gray-600 transition-colors"><i :class="item.quantity > 1 ? 'bx bx-minus' : 'bx bx-trash text-red-500'"></i></button>
                    <input v-model.number="item.quantity" type="number" min="1" class="w-10 text-center bg-transparent border-none text-xs font-bold p-0 focus:ring-0 h-full" />
                    <button @click="item.quantity++" class="w-7 h-full rounded-md bg-white shadow-sm flex items-center justify-center hover:text-brand-maroon text-gray-600 transition-colors"><i class="bx bx-plus"></i></button>
                  </div>
                  <p class="text-sm font-black text-brand-maroon">Rp {{ itemSubTotal(item).toLocaleString('id-ID') }}</p>
                </div>
              </div>

              <!-- Action Bar (Toggle Notes/Addons) -->
              <div class="mt-2.5 flex items-center gap-2 border-t border-gray-100 pt-2">
                <button @click="item._showDetails = !item._showDetails" class="text-[10px] font-bold px-2 py-1 rounded-md transition-colors flex items-center gap-1" :class="item._showDetails ? 'bg-brand-maroon text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                  <i class="bx bx-edit-alt"></i> {{ item._showDetails ? 'Tutup Detail' : 'Catatan & Add-on' }}
                  <span v-if="item.addons.length && !item._showDetails" class="ml-1 w-4 h-4 bg-brand-maroon text-white rounded-full flex items-center justify-center text-[9px]">{{ item.addons.length }}</span>
                </button>
              </div>

              <!-- Expandable Notes & Addons Area -->
              <div v-show="item._showDetails" class="mt-2 pt-2 border-t border-dashed border-gray-200">
                <div class="mb-3">
                  <input v-model="item.notes" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 focus:bg-white transition-all" placeholder="Catatan: Tidak pedas, extra kuah..." />
                </div>
                
                <div>
                  <div class="flex justify-between items-center mb-1.5">
                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Add-Ons</label>
                    <button @click="addAddon(item)" class="text-[10px] font-bold text-brand-maroon hover:text-brand-terracotta bg-brand-maroon/5 px-2 py-0.5 rounded-md transition-colors">+ Tambah</button>
                  </div>
                  <div v-if="!item.addons.length" class="text-[10px] text-gray-400 italic py-1">Tidak ada add-on</div>
                  <div v-for="(addon, aIdx) in item.addons" :key="aIdx" class="flex items-center gap-1.5 mb-1.5 animate-fade-up">
                    <select v-model="addon.addon_id" @change="onAddonChange(addon)" class="flex-1 min-w-0 px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all">
                      <option :value="null" disabled>Pilih add-on</option>
                      <option v-for="a in getAvailableAddons(item)" :key="a.id" :value="a.id">{{ a.name }} — Rp {{ a.price.toLocaleString('id-ID') }}</option>
                    </select>
                    <input v-model.number="addon.quantity" type="number" min="1" class="w-12 px-1 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[11px] text-center outline-none focus:border-brand-maroon/40" placeholder="Qty" />
                    <button @click="item.addons.splice(aIdx, 1)" class="w-6 h-6 flex items-center justify-center shrink-0 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><i class="bx bx-x text-sm"></i></button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Customer & Checkout Accordion -->
        <div class="flex-[2] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col shrink-0">
          
          <!-- Collapsible Customer Info -->
          <div class="border-b border-gray-100 p-3">
            <button @click="showCustomerInfo = !showCustomerInfo" class="w-full flex justify-between items-center text-left">
              <div class="flex items-center gap-2">
                <i class="bx bx-user-circle text-brand-maroon text-lg"></i>
                <span class="font-bold text-sm text-gray-800">Detail Pelanggan</span>
                <span v-if="form.customer_name" class="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Terisi</span>
              </div>
              <i class="bx text-gray-400 transition-transform" :class="showCustomerInfo ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
            </button>
            
            <div v-show="showCustomerInfo" class="mt-3 space-y-2.5 animate-fade-up">
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button @click="form.delivery_type = 'delivery'" :class="form.delivery_type === 'delivery' ? 'bg-white shadow-sm text-brand-maroon' : 'text-gray-500'" class="flex-1 py-1 text-[11px] font-bold rounded-md transition-all">Delivery</button>
                <button @click="form.delivery_type = 'pickup'" :class="form.delivery_type === 'pickup' ? 'bg-white shadow-sm text-brand-maroon' : 'text-gray-500'" class="flex-1 py-1 text-[11px] font-bold rounded-md transition-all">Pickup</button>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="form.delivery_date" type="datetime-local" required class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all" />
                <input v-model="form.customer_phone" type="tel" required class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all" placeholder="Telepon *" />
              </div>
              <input v-model="form.customer_name" type="text" required class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all" placeholder="Nama Pelanggan *" />
              <textarea v-if="form.delivery_type === 'delivery'" v-model="form.delivery_address" rows="2" class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all resize-none" placeholder="Alamat Pengiriman *"></textarea>
              <input v-if="form.delivery_type === 'delivery'" v-model="form.customer_maps" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all" placeholder="Link Maps (Opsional)" />
              <input v-if="form.delivery_type === 'pickup'" v-model="form.delivery_notes" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-[11px] outline-none focus:border-brand-maroon/40 transition-all" placeholder="Catatan (Jam ambil, dll)" />
            </div>
          </div>

          <!-- Checkout Panel -->
          <div class="p-3 bg-brand-maroon/5 flex-1 flex flex-col justify-between">
            <div class="space-y-1.5 mb-3">
              <div class="flex justify-between text-xs"><span class="text-gray-500 font-medium">Subtotal Item</span><span class="font-semibold text-gray-700">Rp {{ grandTotal.toLocaleString('id-ID') }}</span></div>
              <div class="flex justify-between text-xs"><span class="text-gray-500 font-medium">Total Add-on</span><span class="font-semibold text-gray-700">Rp {{ addonsTotal.toLocaleString('id-ID') }}</span></div>
              <div class="border-t border-brand-maroon/10 pt-1.5 mt-1 flex justify-between items-end">
                <span class="text-xs font-bold text-gray-800">Grand Total</span>
                <span class="text-xl font-black text-brand-maroon leading-none">Rp {{ (grandTotal + addonsTotal).toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <div class="space-y-2 mb-3">
              <div class="flex gap-2">
                <select v-model="form.payment_status" class="w-[45%] px-2 py-2 rounded-lg border border-brand-maroon/20 bg-white text-brand-maroon font-bold text-[11px] outline-none focus:ring-2 focus:ring-brand-maroon/20 transition-all">
                  <option value="unpaid">Belum Bayar</option>
                  <option value="dp_received">Bayar DP</option>
                  <option value="paid">Lunas</option>
                </select>
                <input v-if="form.payment_status !== 'unpaid'" v-model="formattedPaidAmount" type="text" class="flex-1 px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 font-bold text-[11px] outline-none focus:border-brand-maroon/40 transition-all" placeholder="Nominal (Rp)" />
              </div>
            </div>

            <button @click="submitOrder" :disabled="saving" class="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-white font-extrabold text-sm py-3 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-80 flex justify-center items-center gap-2">
              <i v-if="saving" class="bx bx-loader-alt bx-spin text-lg"></i>
              <i v-else class="bx bx-check-shield text-lg"></i>
              {{ saving ? 'Menyimpan...' : 'Proses Order' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi, referenceApi } from '../../api/apiService'
import { useAdminStore } from '../../stores/admin'

const router = useRouter()
const store = useAdminStore()
const saving = ref(false)

const refProducts = ref([])
const refAddons = ref([])
const searchQuery = ref('')
const showCustomerInfo = ref(true)

const filteredProducts = computed(() => {
  if (!searchQuery.value) return refProducts.value
  return refProducts.value.filter(p => p.name_full.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// Logic untuk Infinite Scroll Frontend
const displayLimit = ref(16)

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayLimit.value)
})

watch(searchQuery, () => {
  displayLimit.value = 16 // Reset limit ketika user mencari
})

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    if (displayLimit.value < filteredProducts.value.length) {
      displayLimit.value += 16
    }
  }
}

// Get today's date and time for datetime-local (format: YYYY-MM-DDTHH:mm)
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const hours = String(now.getHours()).padStart(2, '0')
const minutes = String(now.getMinutes()).padStart(2, '0')
const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`

const form = ref({
  customer_name: '', customer_phone: '', delivery_address: '', customer_maps: '',
  delivery_date: defaultDateTime, delivery_type: 'delivery', delivery_notes: '',
  payment_status: 'unpaid', paid_amount: 0, order_status: 'pending',
  items: []
})

const totalItemsCount = computed(() => form.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0))

const formattedPaidAmount = computed({
  get() { return form.value.paid_amount ? form.value.paid_amount.toLocaleString('id-ID') : '' },
  set(val) {
    const rawValue = val.toString().replace(/\D/g, '')
    form.value.paid_amount = rawValue ? parseInt(rawValue, 10) : 0
  }
})

// --- Helpers ---
const getProduct = (id) => refProducts.value.find(p => p.id === id)
const getProductName = (id) => getProduct(id)?.name_full || '-'
const getProductPrice = (id) => getProduct(id)?.price || 0
const getProductMinOrder = (id) => getProduct(id)?.min_order || 0

const getAvailableAddons = (item) => {
  if (!item.product_id) return refAddons.value
  const p = getProduct(item.product_id)
  if (!p) return refAddons.value
  return refAddons.value.filter(a => 
    !a.product_id || 
    a.product_id === p.id || 
    (p.parent_id && a.product_id === p.parent_id)
  )
}

const getUnderMinOrderFee = (item) => {
  if (!item.product_id || !item.quantity) return 0
  const minOrder = getProductMinOrder(item.product_id)
  const price = getProductPrice(item.product_id)
  return (item.quantity > 0 && item.quantity < minOrder) ? (price * item.quantity * 0.1) : 0
}

const itemSubTotal = (item) => {
  const price = getProductPrice(item.product_id)
  const base = price * (item.quantity || 0)
  const penalty = getUnderMinOrderFee(item)
  const addonTotal = item.addons.reduce((sum, a) => sum + (a.snapshot_price * a.quantity), 0)
  return base + penalty + addonTotal
}

const grandTotal = computed(() => form.value.items.reduce((sum, item) => sum + (getProductPrice(item.product_id) * (item.quantity || 0)) + getUnderMinOrderFee(item), 0))
const addonsTotal = computed(() => form.value.items.reduce((sum, item) => sum + item.addons.reduce((s, a) => s + a.snapshot_price * a.quantity, 0), 0))

// --- Item management ---
const addToCart = (product) => {
  const existing = form.value.items.find(i => i.product_id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    form.value.items.unshift({ 
      product_id: product.id, 
      quantity: 1, 
      notes: '', 
      addons: [],
      _showDetails: false
    })
  }
}
const removeItem = (idx) => form.value.items.splice(idx, 1)

// --- Add-on management ---
const addAddon = (item) => {
  item.addons.push({ addon_id: null, quantity: 1, snapshot_price: 0, name: '' })
}
const onAddonChange = (addon) => {
  const ref = refAddons.value.find(a => a.id === addon.addon_id)
  if (ref) { addon.snapshot_price = ref.price; addon.name = ref.name }
}

// --- Submit ---
const submitOrder = async () => {
  // Validation
  if (!form.value.customer_name || !form.value.customer_phone || !form.value.delivery_date) {
    showCustomerInfo.value = true
    store.showToast('Lengkapi data pelanggan terlebih dahulu', 'error'); return
  }
  if (form.value.delivery_type === 'delivery' && !form.value.delivery_address) {
    showCustomerInfo.value = true
    store.showToast('Alamat pengiriman wajib diisi untuk pesanan delivery', 'error'); return
  }
  if (!form.value.items.length) { 
    store.showToast('Tambahkan minimal 1 item pesanan', 'error'); return 
  }
  const invalid = form.value.items.some(i => !i.product_id || !i.quantity)
  if (invalid) { 
    store.showToast('Pastikan semua item valid (produk dan jumlah harus diisi)', 'error'); return 
  }

  saving.value = true
  try {
    const finalAddress = form.value.delivery_type === 'pickup' && !form.value.delivery_address 
      ? 'Diambil di Toko (Pickup)' 
      : form.value.delivery_address

    const payload = {
      customer_name: form.value.customer_name,
      customer_phone: form.value.customer_phone,
      customer_maps: form.value.customer_maps,
      delivery_address: finalAddress,
      delivery_date: form.value.delivery_date,
      type_delivery: form.value.delivery_type,
      delivery_notes: form.value.delivery_notes,
      payment_status: form.value.payment_status,
      order_status: form.value.order_status,
      paid_amount: form.value.paid_amount,
      items: form.value.items.map((item) => {
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          notes: item.notes,
          add_ons: item.addons.filter(a => a.addon_id).map(a => ({
            add_on_id: a.addon_id,
            quantity: a.quantity
          }))
        }
      })
    }
    const res = await orderApi.create(payload)
    
    if (res.status === 'success' && res.data && res.data.id) {
      const createdOrder = res.data
      const currentOrderStat = createdOrder.status?.order || 'pending'
      const currentPayStat = createdOrder.status?.payment || 'unpaid'
      const currentPaid = createdOrder.finance?.paid_amount || 0

      if (
        currentOrderStat !== form.value.order_status || 
        currentPayStat !== form.value.payment_status || 
        currentPaid !== form.value.paid_amount
      ) {
        await orderApi.updateStatus(createdOrder.id, {
          order_status: form.value.order_status,
          payment_status: form.value.payment_status,
          paid_amount: form.value.paid_amount
        })
      }
    }

    store.showToast('Order berhasil dibuat!')
    router.push({ name: 'AdminOrders' })
  } finally { saving.value = false }
}

onMounted(async () => {
  const [pRes, adRes] = await Promise.all([
    referenceApi.getProducts(), referenceApi.getAddons()
  ])
  if (pRes.status === 'success') refProducts.value = pRes.data
  if (adRes.status === 'success') refAddons.value = adRes.data
})
</script>

<style scoped>
/* Inline styling classes handled natively by Tailwind CSS */
</style>
