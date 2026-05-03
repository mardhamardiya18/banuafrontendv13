<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Order</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola pesanan catering.</p>
      </div>
      <router-link :to="{ name: 'AdminCreateOrder' }" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
        <i class="bx bx-plus text-lg"></i> Tambah Order
      </router-link>
    </div>

    <!-- Order Table -->
    <DataTable :columns="columns" :data="data" :meta="meta" :loading="loading" :clickable="true"
      v-model:search-query="search" v-model:per-page="perPage"
      search-placeholder="Cari invoice, pelanggan..."
      @page-change="fetchData" @search="onSearch" @row-click="viewOrder">
      
      <!-- Filter Selectors -->
      <template #header>
        <div class="flex flex-wrap items-center gap-3">
          <select v-model="filterOrderStatus" @change="onSearch" class="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none bg-white focus:border-brand-maroon/40 min-w-[160px]">
            <option value="">Semua Status Order</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <select v-model="filterPaymentStatus" @change="onSearch" class="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none bg-white focus:border-brand-maroon/40 min-w-[160px]">
            <option value="">Semua Pembayaran</option>
            <option value="unpaid">Unpaid</option>
            <option value="dp_received">DP Received</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </template>
      <template #cell-invoice_number="{ value }"><span class="font-mono text-xs font-bold text-brand-maroon">{{ value }}</span></template>
      <template #cell-customer_name="{ value, row }"><span class="font-semibold text-gray-800">{{ value || row.customer_snapshot?.name || '-' }}</span></template>
      <template #cell-delivery_date="{ value, row }"><span class="text-gray-600">{{ value || row.delivery?.date || '-' }}</span></template>
      <template #cell-total_amount="{ value, row }"><span class="font-semibold">Rp {{ (value || row.finance?.total_amount || 0).toLocaleString('id-ID') }}</span></template>
      <template #cell-order_status="{ value, row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" :class="statusBadge(value || row.status?.order)">{{ value || row.status?.order || '-' }}</span>
      </template>
      <template #cell-payment_status="{ value, row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" :class="payBadge(value || row.status?.payment)">{{ value || row.status?.payment || '-' }}</span>
      </template>
    </DataTable>

    <!-- Order Detail Slide-over -->
    <teleport to="body">
      <transition name="slideover-bg">
        <div v-if="showDetail" class="fixed inset-0 z-[70] flex justify-end" @click.self="showDetail=false">
          <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
          <transition name="slideover-panel">
            <div v-if="showDetail" class="relative bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl">
              <!-- Header -->
              <div class="sticky top-0 bg-white/90 backdrop-blur-xl z-10 px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Detail Order</h3>
                  <p class="text-xs text-gray-400 font-mono">{{ detail?.invoice_number }}</p>
                </div>
                <button @click="showDetail=false" class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><i class="bx bx-x text-2xl"></i></button>
              </div>

              <div v-if="detailLoading" class="p-7 space-y-4">
                <div v-for="n in 6" :key="n" class="h-5 bg-gray-100 rounded-lg animate-pulse" :style="{width:`${40+Math.random()*50}%`}"></div>
              </div>

              <div v-else-if="detail" class="p-7 space-y-6">
                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="info in orderInfo" :key="info.label" class="bg-gray-50 rounded-xl p-4">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{{ info.label }}</p>
                    <template v-if="info.label === 'Maps' && info.value !== '-'">
                      <a :href="getMapUrl(info.value)" target="_blank" class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-start gap-1.5 break-all">
                        <i class="bx bx-map mt-0.5"></i> Buka di Google Maps
                      </a>
                    </template>
                    <p v-else class="text-sm font-semibold text-gray-800">{{ info.value }}</p>
                  </div>
                </div>

                <!-- Status badges & Actions -->
                <div class="flex items-center justify-between">
                  <div class="flex gap-3">
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase" :class="statusBadge(detail.status?.order)">Order: {{ detail.status?.order }}</span>
                    <span class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase" :class="payBadge(detail.status?.payment)">Payment: {{ detail.status?.payment }}</span>
                  </div>
                  <div class="flex gap-2">
                    <button @click="openStatusModal" class="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors flex items-center gap-1.5">
                      <i class="bx bx-edit text-sm"></i> Update Status
                    </button>
                    <button @click="handleDownloadInvoice" :disabled="downloading" class="text-xs font-semibold text-white bg-brand-maroon hover:bg-brand-maroon/90 px-3 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">
                      <i class="bx text-sm" :class="downloading ? 'bx-loader-alt animate-spin' : 'bx-download'"></i> Download Invoice
                    </button>
                  </div>
                </div>

                <!-- Order Items -->
                <div>
                  <h4 class="text-sm font-bold text-gray-700 mb-3">Order Items</h4>
                  <div class="space-y-3">
                    <div v-for="item in detail.items" :key="item.id" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                      <div class="p-4 flex items-center justify-between cursor-pointer" @click="toggleItem(item.id)">
                        <div class="flex-1 min-w-0 flex items-center gap-3">
                          <img v-if="item.package?.thumbnail" :src="item.package.thumbnail" class="w-10 h-10 object-cover rounded-lg border border-gray-200" alt="">
                          <div>
                            <p class="text-sm font-semibold text-gray-800">{{ item.package?.name || 'Paket' }}</p>
                            <p class="text-xs text-gray-400 mt-0.5">{{ item.quantity }} x Rp {{ (item.snapshots?.price || 0).toLocaleString('id-ID') }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3">
                          <p class="text-sm font-bold text-brand-maroon">Rp {{ (item.sub_total || 0).toLocaleString('id-ID') }}</p>
                          <i :class="expandedItems.includes(item.id)?'bx bx-chevron-up':'bx bx-chevron-down'" class="text-gray-400"></i>
                        </div>
                      </div>
                      <!-- Expanded detail -->
                      <transition name="expand">
                        <div v-if="expandedItems.includes(item.id)" class="px-4 pb-4 space-y-3">
                          <div v-if="item.fees?.under_min_order_fee > 0" class="flex justify-between items-center bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                            <span class="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5"><i class="bx bx-info-circle text-sm"></i> Biaya di bawah minimum order (10%)</span>
                            <span class="text-[11px] font-bold text-amber-700">+ Rp {{ item.fees.under_min_order_fee.toLocaleString('id-ID') }}</span>
                          </div>
                          <div v-if="item.notes" class="text-xs text-gray-500 bg-white rounded-lg p-3 border border-gray-100">
                            <span class="font-semibold text-gray-600">Catatan:</span> {{ item.notes }}
                          </div>
                          <!-- Add-ons -->
                          <div v-if="item.add_ons?.length">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Add-ons</p>
                            <div class="space-y-1">
                              <div v-for="a in item.add_ons" :key="a.id" class="flex justify-between text-xs bg-white rounded-lg p-2.5 border border-gray-100">
                                <span class="text-gray-600">{{ a.name }} ({{ a.quantity }}x)</span>
                                <span class="font-semibold text-gray-800">Rp {{ (a.sub_total || 0).toLocaleString('id-ID') }}</span>
                              </div>
                            </div>
                          </div>
                          <!-- Menu selections -->
                          <div v-if="item.selections?.length">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Selection</p>
                            <div class="flex flex-col gap-1.5">
                              <span v-for="ms in item.selections" :key="ms.id" class="px-2.5 py-2 bg-brand-maroon/5 text-brand-maroon text-xs font-medium rounded-lg flex justify-between items-center">
                                <span>{{ ms.name }}</span>
                                <span class="text-[10px] font-bold opacity-60 uppercase">{{ ms.category }}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>

                <!-- Totals -->
                <div class="bg-gray-50 rounded-2xl p-5 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Total Amount</span><span class="font-bold">Rp {{ (detail.finance?.total_amount || 0).toLocaleString('id-ID') }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Paid</span><span class="font-bold text-emerald-600">Rp {{ (detail.finance?.paid_amount || 0).toLocaleString('id-ID') }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Remaining</span><span class="font-bold text-red-500">Rp {{ ((detail.finance?.total_amount || 0) - (detail.finance?.paid_amount || 0)).toLocaleString('id-ID') }}</span></div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
    <!-- Update Status Modal -->
    <BaseModal v-model="showStatusModal" title="Update Status Pesanan">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Order</label>
          <select v-model="statusForm.order_status" class="w-full border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-brand-maroon focus:ring-brand-maroon/20">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Pembayaran</label>
          <select v-model="statusForm.payment_status" class="w-full border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-brand-maroon focus:ring-brand-maroon/20">
            <option value="unpaid">Unpaid</option>
            <option value="dp_received">DP Received</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nominal Dibayar (Rp)</label>
          <input type="number" v-model="statusForm.paid_amount" class="w-full border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-brand-maroon focus:ring-brand-maroon/20" />
        </div>
        <div class="pt-3 flex justify-end gap-2">
          <button @click="showStatusModal=false" class="px-4 py-2.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium">Batal</button>
          <button @click="saveStatus" :disabled="updatingStatus" class="px-4 py-2.5 text-sm text-white bg-brand-maroon hover:bg-brand-maroon/90 rounded-xl font-medium flex items-center gap-2">
            <i v-if="updatingStatus" class="bx bx-loader-alt animate-spin"></i> Simpan Status
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import { orderApi } from '../../api/apiService'

const loading = ref(false), data = ref([]), meta = ref(null)
const search = ref(''), perPage = ref(10)
const filterOrderStatus = ref('')
const filterPaymentStatus = ref('')
const showDetail = ref(false), detail = ref(null), detailLoading = ref(false)
const expandedItems = ref([])

const columns = [
  { key: 'invoice_number', label: 'Invoice' },
  { key: 'customer_name', label: 'Pelanggan' },
  { key: 'delivery_date', label: 'Tanggal' },
  { key: 'order_status', label: 'Status Order' },
  { key: 'payment_status', label: 'Pembayaran' },
  { key: 'total_amount', label: 'Total' }
]

const statusBadge = (s) => ({
  'bg-emerald-50 text-emerald-600': s === 'completed' || s === 'delivered',
  'bg-blue-50 text-blue-600': s === 'processing',
  'bg-amber-50 text-amber-600': s === 'pending',
  'bg-red-50 text-red-600': s === 'cancelled'
})
const payBadge = (s) => ({
  'bg-emerald-50 text-emerald-600': s === 'paid',
  'bg-amber-50 text-amber-600': s === 'partial',
  'bg-red-50 text-red-600': s === 'unpaid'
})

const fetchData = async (p = 1) => {
  loading.value = true
  try { 
    const r = await orderApi.getAll(p, perPage.value, search.value, filterOrderStatus.value, filterPaymentStatus.value)
    if (r.status === 'success') { data.value = r.data; meta.value = r.meta } 
  } finally { loading.value = false }
}
const onSearch = () => fetchData(1)

const viewOrder = async (row) => {
  showDetail.value = true; detailLoading.value = true; expandedItems.value = []
  try { const r = await orderApi.getById(row.id); if (r.status === 'success') detail.value = r.data }
  finally { detailLoading.value = false }
}

const toggleItem = (id) => {
  const idx = expandedItems.value.indexOf(id)
  idx === -1 ? expandedItems.value.push(id) : expandedItems.value.splice(idx, 1)
}

const getMapUrl = (val) => {
  if (!val || val === '-') return '#'
  if (val.startsWith('http://') || val.startsWith('https://')) return val
  // Jika string tampak seperti domain (misal: goo.gl/maps/xxx) tanpa http
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(val)) return `https://${val}`
  // Jika koordinat atau string pencarian biasa
  return `https://maps.google.com/?q=${encodeURIComponent(val)}`
}

const orderInfo = computed(() => {
  if (!detail.value) return []
  const d = detail.value
  return [
    { label: 'Pelanggan', value: d.customer_snapshot?.name || '-' },
    { label: 'Telepon', value: d.customer_snapshot?.phone || '-' },
    { label: 'Alamat', value: d.delivery?.address || '-' },
    { label: 'Tanggal Kirim', value: d.delivery?.date || '-' },
    { label: 'Tipe Pengiriman', value: d.delivery?.type || '-' },
    { label: 'Catatan', value: d.delivery?.notes || '-' },
    { label: 'Maps', value: d.delivery?.maps || '-' }
  ]
})

// Status & Invoice Logic
const showStatusModal = ref(false)
const statusForm = ref({ payment_status: '', order_status: '', paid_amount: 0 })
const updatingStatus = ref(false)
const downloading = ref(false)

const openStatusModal = () => {
  statusForm.value = {
    payment_status: detail.value.status?.payment || 'unpaid',
    order_status: detail.value.status?.order || 'pending',
    paid_amount: detail.value.finance?.paid_amount || 0
  }
  showStatusModal.value = true
}

const saveStatus = async () => {
  updatingStatus.value = true
  try {
    const r = await orderApi.updateStatus(detail.value.id, statusForm.value)
    if (r.status === 'success') {
      detail.value = r.data
      fetchData(meta.value?.current_page || 1)
      showStatusModal.value = false
    } else {
      alert('Gagal mengupdate status pesanan.')
    }
  } catch (error) {
    alert('Terjadi kesalahan saat mengupdate status: ' + (error.response?.data?.message || error.message))
  } finally {
    updatingStatus.value = false
  }
}

const handleDownloadInvoice = async () => {
  downloading.value = true
  try {
    const response = await orderApi.downloadInvoice(detail.value.id)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${detail.value.invoice_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    alert('Gagal mengunduh invoice: ' + error.message)
  } finally {
    downloading.value = false
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.slideover-bg-enter-active, .slideover-bg-leave-active { transition: opacity 0.3s ease; }
.slideover-bg-enter-from, .slideover-bg-leave-to { opacity: 0; }
.slideover-panel-enter-active { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
.slideover-panel-leave-active { transition: transform 0.25s ease-in; }
.slideover-panel-enter-from { transform: translateX(100%); }
.slideover-panel-leave-to { transform: translateX(100%); }
.expand-enter-active { transition: all 0.3s ease; overflow: hidden; }
.expand-leave-active { transition: all 0.2s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 500px; }
</style>
