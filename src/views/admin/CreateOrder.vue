<template>
  <div class="space-y-6 max-w-5xl">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link :to="{ name: 'AdminOrders' }" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-gray-400 hover:text-gray-700 transition-colors">
        <i class="bx bx-arrow-back text-xl"></i>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Buat Order Manual</h1>
        <p class="text-sm text-gray-500 mt-0.5">Catat pesanan dari customer yang order langsung.</p>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="flex items-center gap-3 overflow-x-auto pb-2">
      <button v-for="(s, i) in stepLabels" :key="i" @click="step > i + 1 && (step = i + 1)"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
        :class="step === i+1 ? 'bg-brand-maroon text-white shadow-sm' : step > i+1 ? 'bg-brand-maroon/10 text-brand-maroon cursor-pointer' : 'bg-gray-100 text-gray-400'">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" :class="step > i+1 ? 'bg-brand-maroon text-white' : step === i+1 ? 'bg-white/20' : 'bg-gray-200'">
          <i v-if="step > i+1" class="bx bx-check"></i><span v-else>{{ i+1 }}</span>
        </span>
        {{ s }}
      </button>
    </div>

    <!-- Step 1: Customer Info -->
    <div v-if="step === 1" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 animate-fade-up">
      <h3 class="text-lg font-bold text-gray-800">Informasi Pelanggan</h3>
      <div class="grid sm:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Pelanggan *</label>
          <input v-model="form.customer_name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all" placeholder="Nama lengkap" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon *</label>
          <input v-model="form.customer_phone" type="tel" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all" placeholder="08xxxxxxxxxx" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Alamat Pengiriman *</label>
        <textarea v-model="form.delivery_address" rows="2" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all resize-none" placeholder="Alamat lengkap"></textarea>
      </div>
      <div class="grid sm:grid-cols-3 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Tanggal & Waktu Kirim *</label>
          <input v-model="form.delivery_date" type="datetime-local" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Tipe Pengiriman</label>
          <select v-model="form.delivery_type" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all bg-white">
            <option value="delivery">Delivery (Antar)</option>
            <option value="pickup">Pickup (Ambil Sendiri)</option>
            <option value="setup">Setup (Prasmanan)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Catatan Kirim</label>
          <input v-model="form.delivery_notes" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all" placeholder="Opsional" />
        </div>
      </div>
      <div class="flex justify-end pt-2">
        <button @click="goStep2" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-60">Lanjut — Pilih Produk <i class="bx bx-right-arrow-alt"></i></button>
      </div>
    </div>

    <!-- Step 2: Order Items -->
    <div v-if="step === 2" class="space-y-5 animate-fade-up">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">Item Pesanan</h3>
          <button @click="addItem" class="flex items-center gap-1.5 text-sm font-semibold text-brand-maroon hover:text-brand-terracotta transition-colors">
            <i class="bx bx-plus-circle text-lg"></i> Tambah Item
          </button>
        </div>

        <div v-if="!form.items.length" class="py-10 text-center">
          <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><i class="bx bx-cart text-2xl text-gray-300"></i></div>
          <p class="text-gray-400 font-medium text-sm">Belum ada item. Klik tombol "Tambah Item" di atas.</p>
        </div>

        <!-- Each item card -->
        <div v-for="(item, idx) in form.items" :key="idx" class="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4">
          <div class="flex items-start justify-between">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Item #{{ idx + 1 }}</span>
            <button @click="removeItem(idx)" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><i class="bx bx-trash text-sm"></i></button>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Sub Produk *</label>
              <select v-model="item.sub_product_id" @change="onSubProductChange(item)" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 transition-all bg-white">
                <option :value="null" disabled>Pilih paket</option>
                <option v-for="sp in refSubProducts" :key="sp.id" :value="sp.id">{{ sp.name }} — Rp {{ sp.price.toLocaleString('id-ID') }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Jumlah *</label>
                <input v-model.number="item.quantity" type="number" min="1" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
                <p class="text-sm font-bold text-brand-maroon mt-2">Rp {{ itemSubTotal(item).toLocaleString('id-ID') }}</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Catatan Item</label>
            <input v-model="item.notes" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 transition-all" placeholder="Tidak pedas, dll" />
          </div>

          <!-- Add-ons section -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Add-ons</span>
              <button @click="addAddon(item)" class="text-xs font-semibold text-brand-maroon hover:text-brand-terracotta">+ Add-on</button>
            </div>
            <div v-for="(addon, aIdx) in item.addons" :key="aIdx" class="flex items-center gap-3 mb-2">
              <select v-model="addon.addon_id" @change="onAddonChange(addon, item)" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 transition-all bg-white flex-1">
                <option :value="null" disabled>Pilih add-on</option>
                <option v-for="a in getAvailableAddons(item)" :key="a.id" :value="a.id">{{ a.name }} — Rp {{ a.price.toLocaleString('id-ID') }}</option>
              </select>
              <input v-model.number="addon.quantity" type="number" min="1" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 transition-all w-20" placeholder="Qty" />
              <span class="text-xs font-semibold text-gray-500 w-28 text-right">Rp {{ (addon.snapshot_price * addon.quantity).toLocaleString('id-ID') }}</span>
              <button @click="item.addons.splice(aIdx, 1)" class="text-gray-400 hover:text-red-500"><i class="bx bx-x"></i></button>
            </div>
          </div>

          <!-- Menu selections -->
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Pilihan Menu</span>
            <div class="flex flex-wrap gap-2">
              <label v-for="mi in refMenuItems" :key="mi.id" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all"
                :class="isMenuSelected(item, mi.name) ? 'bg-brand-maroon/10 border-brand-maroon/30 text-brand-maroon' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'">
                <input type="checkbox" :checked="isMenuSelected(item, mi.name)" @change="toggleMenu(item, mi.name)" class="sr-only" />
                <i class="bx" :class="isMenuSelected(item, mi.name) ? 'bx-check-circle' : 'bx-circle'"></i>
                {{ mi.name }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <button @click="step = 1" class="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 px-5 py-3 rounded-xl hover:bg-white transition-colors"><i class="bx bx-left-arrow-alt"></i> Kembali</button>
        <button @click="goStep3" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-60">Lanjut — Ringkasan <i class="bx bx-right-arrow-alt"></i></button>
      </div>
    </div>

    <!-- Step 3: Summary & Payment -->
    <div v-if="step === 3" class="space-y-5 animate-fade-up">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 class="text-lg font-bold text-gray-800">Ringkasan Order</h3>

        <!-- Customer summary -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-4"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pelanggan</p><p class="text-sm font-semibold">{{ form.customer_name }}</p></div>
          <div class="bg-gray-50 rounded-xl p-4"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Telepon</p><p class="text-sm font-semibold">{{ form.customer_phone }}</p></div>
          <div class="bg-gray-50 rounded-xl p-4"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat</p><p class="text-sm font-semibold">{{ form.delivery_address }}</p></div>
          <div class="bg-gray-50 rounded-xl p-4"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal</p><p class="text-sm font-semibold">{{ form.delivery_date }} · {{ form.delivery_type }}</p></div>
        </div>

        <!-- Items summary -->
        <div class="space-y-3">
          <p class="text-sm font-bold text-gray-700">Detail Item</p>
          <div v-for="(item, idx) in form.items" :key="idx" class="bg-gray-50 rounded-xl p-4 space-y-2">
            <div class="flex justify-between">
              <p class="text-sm font-semibold text-gray-800">{{ getSubProductName(item.sub_product_id) }}</p>
              <p class="text-sm font-bold text-brand-maroon">Rp {{ itemSubTotal(item).toLocaleString('id-ID') }}</p>
            </div>
            <p class="text-xs text-gray-400">{{ item.quantity }} pcs × Rp {{ getSubProductPrice(item.sub_product_id).toLocaleString('id-ID') }}</p>
            <div v-if="item.addons.length" class="text-xs text-gray-500">
              <span v-for="(a, i) in item.addons" :key="i">{{ getAddonName(a.addon_id) }} ({{ a.quantity }}x)<span v-if="i < item.addons.length-1">, </span></span>
            </div>
            <div v-if="item.menu_selections.length" class="flex flex-wrap gap-1">
              <span v-for="ms in item.menu_selections" :key="ms.menu_name" class="px-2 py-0.5 bg-brand-maroon/5 text-brand-maroon text-[10px] font-medium rounded">{{ ms.menu_name }}</span>
            </div>
          </div>
        </div>

        <!-- Totals & Payment -->
        <div class="bg-gray-50 rounded-xl p-5 space-y-3">
          <div class="flex justify-between text-sm"><span class="text-gray-500">Total Item</span><span class="font-bold text-lg">Rp {{ grandTotal.toLocaleString('id-ID') }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-gray-500">Total Add-on</span><span class="font-semibold">Rp {{ addonsTotal.toLocaleString('id-ID') }}</span></div>
          <hr class="border-gray-200" />
          <div class="flex justify-between text-base"><span class="font-bold text-gray-800">Grand Total</span><span class="font-bold text-brand-maroon text-lg">Rp {{ (grandTotal + addonsTotal).toLocaleString('id-ID') }}</span></div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Dibayar</label>
            <input v-model.number="form.paid_amount" type="number" min="0" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all" placeholder="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Status Pembayaran</label>
            <select v-model="form.payment_status" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all bg-white">
              <option value="unpaid">Belum Bayar</option>
              <option value="partial">Bayar Sebagian (DP)</option>
              <option value="paid">Lunas</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <button @click="step = 2" class="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 px-5 py-3 rounded-xl hover:bg-white transition-colors"><i class="bx bx-left-arrow-alt"></i> Kembali</button>
        <button @click="submitOrder" :disabled="saving" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-60">
          <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>
          <i v-else class="bx bx-check-circle"></i>
          {{ saving ? 'Menyimpan...' : 'Simpan Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi, referenceApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const router = useRouter()
const store = useAdminStore()
const step = ref(1)
const saving = ref(false)
const stepLabels = ['Pelanggan', 'Item Pesanan', 'Ringkasan']

const refSubProducts = ref([])
const refAddons = ref([])
const refMenuItems = ref([])

// Get today's date and time for datetime-local (format: YYYY-MM-DDTHH:mm)
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const hours = String(now.getHours()).padStart(2, '0')
const minutes = String(now.getMinutes()).padStart(2, '0')
const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`

const form = ref({
  customer_name: '', customer_phone: '', delivery_address: '',
  delivery_date: defaultDateTime, delivery_type: 'delivery', delivery_notes: '',
  payment_status: 'unpaid', paid_amount: 0, order_status: 'pending',
  items: []
})

// --- Helpers ---
const getSubProduct = (id) => refSubProducts.value.find(sp => sp.id === id)
const getSubProductName = (id) => getSubProduct(id)?.name || '-'
const getSubProductPrice = (id) => getSubProduct(id)?.price || 0
const getAddonName = (id) => refAddons.value.find(a => a.id === id)?.name || '-'

const getAvailableAddons = (item) => {
  if (!item.sub_product_id) return refAddons.value
  const sp = getSubProduct(item.sub_product_id)
  if (!sp) return refAddons.value
  const filtered = refAddons.value.filter(a => a.sub_product_id === sp.id)
  return filtered.length ? filtered : refAddons.value
}

const itemSubTotal = (item) => {
  const price = getSubProductPrice(item.sub_product_id)
  const base = price * (item.quantity || 0)
  const addonTotal = item.addons.reduce((sum, a) => sum + (a.snapshot_price * a.quantity), 0)
  return base + addonTotal
}

const grandTotal = computed(() => form.value.items.reduce((sum, item) => sum + getSubProductPrice(item.sub_product_id) * (item.quantity || 0), 0))
const addonsTotal = computed(() => form.value.items.reduce((sum, item) => sum + item.addons.reduce((s, a) => s + a.snapshot_price * a.quantity, 0), 0))

// --- Item management ---
const addItem = () => {
  form.value.items.push({ sub_product_id: null, quantity: 1, notes: '', addons: [], menu_selections: [] })
}
const removeItem = (idx) => form.value.items.splice(idx, 1)

const onSubProductChange = (item) => {
  item.addons = []
  item.menu_selections = []
}

// --- Add-on management ---
const addAddon = (item) => {
  item.addons.push({ addon_id: null, quantity: 1, snapshot_price: 0, name: '' })
}
const onAddonChange = (addon) => {
  const ref = refAddons.value.find(a => a.id === addon.addon_id)
  if (ref) { addon.snapshot_price = ref.price; addon.name = ref.name }
}

// --- Menu selection ---
const isMenuSelected = (item, name) => item.menu_selections.some(ms => ms.menu_name === name)
const toggleMenu = (item, name) => {
  const idx = item.menu_selections.findIndex(ms => ms.menu_name === name)
  idx === -1 ? item.menu_selections.push({ menu_name: name }) : item.menu_selections.splice(idx, 1)
}

// --- Validation & Navigation ---
const goStep2 = () => {
  if (!form.value.customer_name || !form.value.customer_phone || !form.value.delivery_address || !form.value.delivery_date) {
    store.showToast('Lengkapi data pelanggan terlebih dahulu', 'error'); return
  }
  step.value = 2
}
const goStep3 = () => {
  if (!form.value.items.length) { store.showToast('Tambahkan minimal 1 item pesanan', 'error'); return }
  const invalid = form.value.items.some(i => !i.sub_product_id || !i.quantity)
  if (invalid) { store.showToast('Pastikan semua item memiliki produk dan jumlah', 'error'); return }
  step.value = 3
}

// --- Submit ---
const submitOrder = async () => {
  saving.value = true
  try {
    const now = new Date()
    const invNum = `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*999)).padStart(3,'0')}`
    const total = grandTotal.value + addonsTotal.value

    const payload = {
      ...form.value,
      invoice_number: invNum,
      total_amount: total,
      total_cost: Math.round(total * 0.65),
      items: form.value.items.map((item, idx) => {
        const sp = getSubProduct(item.sub_product_id)
        return {
          id: idx + 1, sub_product_id: item.sub_product_id,
          sub_product_name: sp?.name || '-', quantity: item.quantity,
          snapshot_price: sp?.price || 0, snapshot_cost: sp?.cost || 0,
          under_min_order_fee: 0, sub_total: itemSubTotal(item),
          notes: item.notes,
          addons: item.addons.filter(a => a.addon_id).map(a => ({
            id: a.addon_id, name: a.name, quantity: a.quantity,
            snapshot_price: a.snapshot_price, sub_total: a.snapshot_price * a.quantity
          })),
          menu_selections: item.menu_selections
        }
      })
    }
    await orderApi.create(payload)
    store.showToast('Order berhasil dibuat!')
    router.push({ name: 'AdminOrders' })
  } finally { saving.value = false }
}

onMounted(async () => {
  const [spRes, adRes, miRes] = await Promise.all([
    referenceApi.getSubProducts(), referenceApi.getAddons(), referenceApi.getMenuItems()
  ])
  if (spRes.status === 'success') refSubProducts.value = spRes.data
  if (adRes.status === 'success') refAddons.value = adRes.data
  if (miRes.status === 'success') refMenuItems.value = miRes.data
})
</script>

<style scoped>
/* Scoped styles removed to avoid Tailwind compile errors, using inline classes instead */
</style>
