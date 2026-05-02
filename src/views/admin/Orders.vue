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
      search-placeholder="Cari invoice, pelanggan, status..."
      @page-change="fetchData" @search="onSearch" @row-click="viewOrder">
      <template #cell-invoice_number="{ value }"><span class="font-mono text-xs font-bold text-brand-maroon">{{ value }}</span></template>
      <template #cell-customer_name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
      <template #cell-delivery_date="{ value }"><span class="text-gray-600">{{ value }}</span></template>
      <template #cell-total_amount="{ value }"><span class="font-semibold">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #cell-order_status="{ value }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" :class="statusBadge(value)">{{ value }}</span>
      </template>
      <template #cell-payment_status="{ value }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" :class="payBadge(value)">{{ value }}</span>
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
                    <p class="text-sm font-semibold text-gray-800">{{ info.value }}</p>
                  </div>
                </div>

                <!-- Status badges -->
                <div class="flex gap-3">
                  <span class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase" :class="statusBadge(detail.order_status)">Order: {{ detail.order_status }}</span>
                  <span class="px-3 py-1.5 rounded-xl text-xs font-bold uppercase" :class="payBadge(detail.payment_status)">Payment: {{ detail.payment_status }}</span>
                </div>

                <!-- Order Items -->
                <div>
                  <h4 class="text-sm font-bold text-gray-700 mb-3">Order Items</h4>
                  <div class="space-y-3">
                    <div v-for="item in detail.items" :key="item.id" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                      <div class="p-4 flex items-center justify-between cursor-pointer" @click="toggleItem(item.id)">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-gray-800">{{ item.sub_product_name }}</p>
                          <p class="text-xs text-gray-400 mt-0.5">{{ item.quantity }} x Rp {{ item.snapshot_price.toLocaleString('id-ID') }}</p>
                        </div>
                        <div class="flex items-center gap-3">
                          <p class="text-sm font-bold text-brand-maroon">Rp {{ item.sub_total.toLocaleString('id-ID') }}</p>
                          <i :class="expandedItems.includes(item.id)?'bx bx-chevron-up':'bx bx-chevron-down'" class="text-gray-400"></i>
                        </div>
                      </div>
                      <!-- Expanded detail -->
                      <transition name="expand">
                        <div v-if="expandedItems.includes(item.id)" class="px-4 pb-4 space-y-3">
                          <div v-if="item.notes" class="text-xs text-gray-500 bg-white rounded-lg p-3 border border-gray-100">
                            <span class="font-semibold text-gray-600">Catatan:</span> {{ item.notes }}
                          </div>
                          <!-- Add-ons -->
                          <div v-if="item.addons?.length">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Add-ons</p>
                            <div class="space-y-1">
                              <div v-for="a in item.addons" :key="a.id" class="flex justify-between text-xs bg-white rounded-lg p-2.5 border border-gray-100">
                                <span class="text-gray-600">{{ a.name }} ({{ a.quantity }}x)</span>
                                <span class="font-semibold text-gray-800">Rp {{ a.sub_total.toLocaleString('id-ID') }}</span>
                              </div>
                            </div>
                          </div>
                          <!-- Menu selections -->
                          <div v-if="item.menu_selections?.length">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Selection</p>
                            <div class="flex flex-wrap gap-1.5">
                              <span v-for="ms in item.menu_selections" :key="ms.menu_name" class="px-2.5 py-1 bg-brand-maroon/5 text-brand-maroon text-xs font-medium rounded-lg">{{ ms.menu_name }}</span>
                            </div>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>

                <!-- Totals -->
                <div class="bg-gray-50 rounded-2xl p-5 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Total Amount</span><span class="font-bold">Rp {{ detail.total_amount.toLocaleString('id-ID') }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Paid</span><span class="font-bold text-emerald-600">Rp {{ detail.paid_amount.toLocaleString('id-ID') }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Remaining</span><span class="font-bold text-red-500">Rp {{ (detail.total_amount - detail.paid_amount).toLocaleString('id-ID') }}</span></div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import { orderApi } from '../../api/mockService'

const loading = ref(false), data = ref([]), meta = ref(null)
const search = ref(''), perPage = ref(10)
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
  try { const r = await orderApi.getAll(p, perPage.value, search.value); if (r.status === 'success') { data.value = r.data; meta.value = r.meta } }
  finally { loading.value = false }
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

const orderInfo = computed(() => {
  if (!detail.value) return []
  const d = detail.value
  return [
    { label: 'Pelanggan', value: d.customer_name },
    { label: 'Telepon', value: d.customer_phone },
    { label: 'Alamat', value: d.delivery_address },
    { label: 'Tanggal Kirim', value: d.delivery_date },
    { label: 'Tipe Pengiriman', value: d.delivery_type },
    { label: 'Catatan', value: d.delivery_notes || '-' }
  ]
})

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
