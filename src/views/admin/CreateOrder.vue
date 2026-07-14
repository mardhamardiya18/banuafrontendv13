<template>
  <div class="h-full min-h-[calc(100vh-6rem)] flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <div class="flex items-center gap-4">
        <router-link :to="{ name: 'AdminOrders' }" class="w-10 h-10 flex items-center justify-center rounded-xl transition-colors shadow-sm"
                     style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(160,160,192,0.8);"
                     onmouseenter="this.style.background='rgba(255,255,255,0.1)';"
                     onmouseleave="this.style.background='rgba(255,255,255,0.05)';">
          <i class="bx bx-arrow-back text-xl"></i>
        </router-link>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold leading-tight" style="color: rgba(224,224,239,0.955);">Point of Sale</h1>
          <p class="text-xs sm:text-sm" style="color: rgba(160,160,192,0.6);">Buat pesanan baru secara manual</p>
        </div>
      </div>
      <div class="hidden sm:block text-right">
        <p class="text-sm font-bold" style="color: rgba(200,200,230,0.8);">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="flex flex-col lg:flex-row gap-5 flex-1 min-h-0 overflow-hidden">
      
      <!-- LEFT: Product Grid -->
      <div class="flex-[3] flex flex-col rounded-2xl overflow-hidden shadow-sm min-h-0"
           style="background: #0a0a0f; border: 1px solid rgba(255,255,255,0.05);">
        <!-- Search Header -->
        <div class="p-4 flex gap-4 shrink-0" style="background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div class="relative flex-1">
            <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg" style="color: rgba(160,160,192,0.5);"></i>
            <input v-model="searchQuery" type="text" placeholder="Cari menu produk..." class="dark-input pl-10" />
          </div>
        </div>

        <!-- Grid -->
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar" @scroll="handleScroll" style="background: rgba(10,10,15,0.5);">
          <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
            <i class="bx bx-dish text-6xl mb-4" style="color: rgba(160,160,192,0.3);"></i>
            <h3 class="text-lg font-bold" style="color: rgba(220,220,240,0.8);">Tidak ada produk</h3>
            <p class="text-sm" style="color: rgba(160,160,192,0.6);">Coba kata kunci lain.</p>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-4">
            <div 
              v-for="product in displayedProducts" 
              :key="product.id" 
              @click="addToCart(product)" 
              class="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col animate-fade-up"
              style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);"
              onmouseenter="this.style.borderColor='rgba(139,92,246,0.4)';"
              onmouseleave="this.style.borderColor='rgba(255,255,255,0.06)';"
            >
              <div class="aspect-[4/3] relative overflow-hidden" style="background: rgba(255,255,255,0.02);">
                <img loading="lazy" decoding="async" :src="product.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute bottom-2 right-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style="background: rgba(139,92,246,0.9); color: white;"><i class="bx bx-plus font-bold"></i></div>
                </div>
              </div>
              <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p class="font-bold text-xs sm:text-sm line-clamp-2 leading-tight transition-colors"
                     style="color: rgba(230,230,250,0.95);">{{ product.name_full }}</p>
                  <p v-if="product.min_order > 1" class="text-[10px] mt-1 font-semibold" style="color: #fbbf24;">Min: {{ product.min_order }} pcs</p>
                </div>
                <div class="mt-2">
                  <p class="font-black text-sm sm:text-base" style="color: #a78bfa;">Rp {{ formatRp(product.price) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Cart & Checkout -->
      <div class="w-full lg:w-[420px] xl:w-[460px] flex flex-col gap-4 shrink-0 h-full min-h-0">
        
        <!-- Cart List (Scrollable) -->
        <div class="flex-[3] rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[300px]"
             style="background: #0a0a0f; border: 1px solid rgba(255,255,255,0.05);">
          <div class="p-3.5 flex justify-between items-center shrink-0"
               style="background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05);">
            <h2 class="font-bold flex items-center gap-2" style="color: rgba(220,220,240,0.9);"><i class="bx bx-cart" style="color: #a78bfa;"></i> Keranjang</h2>
            <span class="px-2 py-0.5 rounded-md text-xs font-bold"
                  style="background: rgba(139,92,246,0.15); color: #a78bfa;">{{ totalItemsCount }} item</span>
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-3 relative custom-scrollbar">
            <div v-if="!form.items.length" class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-50">
              <i class="bx bx-cart-add text-5xl mb-2" style="color: rgba(160,160,192,0.4);"></i>
              <p class="text-sm font-semibold" style="color: rgba(160,160,192,0.6);">Keranjang masih kosong</p>
            </div>

            <!-- Cart Items -->
            <div v-for="(item, idx) in form.items" :key="idx" class="rounded-xl p-3 shadow-sm relative group animate-fade-up"
                 style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
              
              <!-- Top Row: Info & Controls -->
              <div class="flex justify-between items-start gap-2">
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-sm leading-tight pr-2" style="color: rgba(230,230,250,0.95);">{{ getProductName(item.product_id) }}</p>
                  <p class="text-[11px] mt-0.5 font-medium" style="color: rgba(160,160,192,0.6);">Rp {{ formatRp(getProductPrice(item.product_id)) }} / pc</p>
                  <p v-if="getUnderMinOrderFee(item) > 0" class="text-[10px] font-bold mt-1" style="color: #fbbf24;">+Rp {{ formatRp(getUnderMinOrderFee(item)) }} (Fee Min. Order)</p>
                </div>
                
                <div class="flex flex-col items-end gap-2 shrink-0">
                  <!-- Stepper -->
                  <div class="flex items-center gap-0.5 rounded-lg p-0.5 h-8" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);">
                    <button @click="item.quantity > 1 ? item.quantity-- : removeItem(idx)" class="w-7 h-full rounded-md flex items-center justify-center transition-colors"
                            style="background: rgba(255,255,255,0.05); color: rgba(200,200,220,0.8);"
                            onmouseenter="this.style.background='rgba(255,255,255,0.1)';"
                            onmouseleave="this.style.background='rgba(255,255,255,0.05)';"><i :class="item.quantity > 1 ? 'bx bx-minus' : 'bx bx-trash text-red-400'"></i></button>
                    <input v-model.number="item.quantity" type="number" min="1" class="w-10 text-center bg-transparent border-none text-xs font-bold p-0 focus:ring-0 h-full" style="color: rgba(230,230,250,0.95);" />
                    <button @click="item.quantity++" class="w-7 h-full rounded-md flex items-center justify-center transition-colors"
                            style="background: rgba(255,255,255,0.05); color: rgba(200,200,220,0.8);"
                            onmouseenter="this.style.background='rgba(255,255,255,0.1)';"
                            onmouseleave="this.style.background='rgba(255,255,255,0.05)';"><i class="bx bx-plus"></i></button>
                  </div>
                  <p class="text-sm font-black" style="color: #a78bfa;">Rp {{ formatRp(itemSubTotal(item)) }}</p>
                </div>
              </div>

              <!-- Action Bar (Toggle Notes/Addons) -->
              <div class="mt-2.5 flex items-center gap-2 pt-2" style="border-top: 1px solid rgba(255,255,255,0.06);">
                <button @click="item._showDetails = !item._showDetails" class="text-[10px] font-bold px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                        :style="item._showDetails ? 'background: rgba(139,92,246,0.2); color: #a78bfa;' : 'background: rgba(255,255,255,0.05); color: rgba(160,160,192,0.8);'">
                  <i class="bx bx-edit-alt"></i> {{ item._showDetails ? 'Tutup Detail' : 'Catatan & Add-on' }}
                  <span v-if="item.addons.length && !item._showDetails" class="ml-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                        style="background: #a78bfa; color: #1a1a2e;">{{ item.addons.length }}</span>
                </button>
              </div>

              <!-- Expandable Notes & Addons Area -->
              <div v-show="item._showDetails" class="mt-2 pt-2 border-t border-dashed" style="border-color: rgba(255,255,255,0.1);">
                <div class="mb-3">
                  <input v-model="item.notes" type="text" class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px]" placeholder="Catatan: Tidak pedas, extra kuah..." />
                </div>
                
                <div>
                  <div class="flex justify-between items-center mb-1.5">
                    <label class="block text-[10px] font-bold uppercase tracking-wider" style="color: rgba(160,160,192,0.6);">Add-Ons</label>
                    <button @click="addAddon(item)" class="text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors"
                            style="background: rgba(139,92,246,0.15); color: #a78bfa;">+ Tambah</button>
                  </div>
                  <div v-if="!item.addons.length" class="text-[10px] italic py-1" style="color: rgba(160,160,192,0.4);">Tidak ada add-on</div>
                  <div v-for="(addon, aIdx) in item.addons" :key="aIdx" class="flex items-center gap-1.5 mb-1.5 animate-fade-up">
                    <select v-model="addon.addon_id" @change="onAddonChange(addon)" class="dark-select flex-1 min-w-0 px-2 py-1.5 rounded-lg text-[11px]" style="background-position: right 0.5rem center; padding-right: 1.5rem; color: rgba(224,224,239,0.95);">
                      <option :value="null" disabled style="color: rgba(160,160,192,0.6);">Pilih add-on</option>
                      <option v-for="a in getAvailableAddons(item)" :key="a.id" :value="a.id" style="color: rgba(224,224,239,0.95);">{{ a.name }} (+Rp {{ formatRp(a.price) }})</option>
                    </select>
                    <input v-model.number="addon.quantity" type="number" min="1" class="dark-input !w-[55px] flex-none px-1 py-1.5 rounded-lg text-[11px] text-center" placeholder="Qty" />
                    <button @click="item.addons.splice(aIdx, 1)" class="w-6 h-6 flex items-center justify-center flex-none rounded-md transition-colors"
                            style="background: rgba(248,113,113,0.1); color: #f87171;"
                            onmouseenter="this.style.background='rgba(248,113,113,0.2)';"
                            onmouseleave="this.style.background='rgba(248,113,113,0.1)';"><i class="bx bx-x text-sm"></i></button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Customer & Checkout Accordion -->
        <div class="flex-[2] rounded-2xl shadow-sm flex flex-col shrink-0"
             style="background: #0a0a0f; border: 1px solid rgba(255,255,255,0.05);">
          
          <!-- Collapsible Customer Info -->
          <div class="p-3" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <button @click="showCustomerInfo = !showCustomerInfo" class="w-full flex justify-between items-center text-left">
              <div class="flex items-center gap-2">
                <i class="bx bx-user-circle text-lg" style="color: #a78bfa;"></i>
                <span class="font-bold text-sm" style="color: rgba(220,220,240,0.9);">Detail Pelanggan</span>
                <span v-if="form.customer_name" class="text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style="background: rgba(52,211,153,0.15); color: #34d399;">Terisi</span>
              </div>
              <i class="bx transition-transform" :class="showCustomerInfo ? 'bx-chevron-up' : 'bx-chevron-down'" style="color: rgba(160,160,192,0.5);"></i>
            </button>
            
            <div v-show="showCustomerInfo" class="mt-3 space-y-2.5 animate-fade-up">
              <div class="flex rounded-lg p-1" style="background: rgba(255,255,255,0.05);">
                <button @click="form.delivery_type = 'delivery'" :class="form.delivery_type === 'delivery' ? 'shadow-sm' : ''" class="flex-1 py-1 text-[11px] font-bold rounded-md transition-all"
                        :style="form.delivery_type === 'delivery' ? 'background: rgba(139,92,246,0.2); color: #a78bfa;' : 'color: rgba(160,160,192,0.6);'">Delivery</button>
                <button @click="form.delivery_type = 'pickup'" :class="form.delivery_type === 'pickup' ? 'shadow-sm' : ''" class="flex-1 py-1 text-[11px] font-bold rounded-md transition-all"
                        :style="form.delivery_type === 'pickup' ? 'background: rgba(139,92,246,0.2); color: #a78bfa;' : 'color: rgba(160,160,192,0.6);'">Pickup</button>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="form.delivery_date" type="datetime-local" required class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px]" />
                <input v-model="form.customer_phone" type="tel" required class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px]" placeholder="Telepon *" />
              </div>
              <input v-model="form.customer_name" type="text" required class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px]" placeholder="Nama Pelanggan *" />
              <textarea v-if="form.delivery_type === 'delivery'" v-model="form.delivery_address" rows="2" class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px] resize-none" placeholder="Alamat Pengiriman *"></textarea>
              <input v-if="form.delivery_type === 'delivery'" v-model="form.customer_maps" type="text" class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px]" placeholder="Link Maps (Opsional)" />
              <input v-if="form.delivery_type === 'pickup'" v-model="form.delivery_notes" type="text" class="dark-input w-full px-2.5 py-1.5 rounded-lg text-[11px]" placeholder="Catatan (Jam ambil, dll)" />
            </div>
          </div>

          <!-- Checkout Panel -->
          <div class="p-3 flex-1 flex flex-col justify-between" style="background: rgba(139,92,246,0.03);">
            <div class="space-y-1.5 mb-3">
              <div class="flex justify-between text-xs"><span style="color: rgba(160,160,192,0.7);">Subtotal Item</span><span class="font-semibold" style="color: rgba(220,220,240,0.9);">Rp {{ formatRp(grandTotal) }}</span></div>
              <div class="flex justify-between text-xs"><span style="color: rgba(160,160,192,0.7);">Total Add-on</span><span class="font-semibold" style="color: rgba(220,220,240,0.9);">Rp {{ formatRp(addonsTotal) }}</span></div>
              <div class="pt-1.5 mt-1 flex justify-between items-end" style="border-top: 1px solid rgba(255,255,255,0.08);">
                <span class="text-xs font-bold" style="color: rgba(220,220,240,0.9);">Grand Total</span>
                <span class="text-xl font-black leading-none" style="color: #a78bfa;">Rp {{ formatRp(grandTotal + addonsTotal) }}</span>
              </div>
            </div>

            <div class="space-y-2 mb-3">
              <div class="flex gap-2">
                <select v-model="form.payment_status" class="dark-select flex-1 min-w-0 px-2 py-2 rounded-lg font-bold text-[11px]" style="color: #a78bfa; background-color: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.2);">
                  <option value="unpaid">Belum Bayar</option>
                  <option value="dp_received">Bayar DP</option>
                  <option value="paid">Lunas</option>
                </select>
                <div v-if="form.payment_status !== 'unpaid'" class="flex-1 flex items-center min-w-0 bg-white/5 border border-white/10 rounded-lg px-2.5 transition-colors focus-within:border-purple-500 focus-within:bg-purple-500/5 focus-within:ring-3 focus-within:ring-purple-500/10">
                  <span class="text-[11px] font-bold mr-1" style="color: rgba(160,160,192,0.6);">Rp</span>
                  <input v-model="formattedPaidAmount" type="text" class="w-full min-w-0 py-2 bg-transparent border-none outline-none font-bold text-[11px] placeholder-gray-500" style="color: rgba(224,224,239,0.95);" placeholder="0" />
                </div>
              </div>
            </div>

            <button @click="submitOrder" :disabled="saving" class="w-full font-extrabold text-sm py-3 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-80 flex justify-center items-center gap-2"
                    style="background: #a78bfa; color: #1a1a2e;"
                    onmouseenter="this.style.background='#c4b5fd';"
                    onmouseleave="this.style.background='#a78bfa';">
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

const formatRp = (val) => {
  if (val === null || val === undefined || val === '') return '0'
  const num = Number(val)
  return isNaN(num) ? '0' : num.toLocaleString('id-ID')
}

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
/* Scoped styles clean */
</style>
