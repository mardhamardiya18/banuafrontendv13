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
        <div class="flex flex-col sm:flex-row w-full gap-3">
          <select v-model="filterOrderStatus" @change="onSearch" class="dark-select flex-1 sm:flex-none min-w-[180px]" style="width: auto;">
            <option value="">Semua Status Order</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <select v-model="filterPaymentStatus" @change="onSearch" class="dark-select flex-1 sm:flex-none min-w-[180px]" style="width: auto;">
            <option value="">Semua Pembayaran</option>
            <option value="unpaid">Unpaid</option>
            <option value="dp_received">DP Received</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </template>
      <template #cell-invoice_number="{ value }"><span class="font-mono text-xs font-bold" style="color: #a78bfa;">{{ value }}</span></template>
      <template #cell-customer_name="{ value, row }"><span class="font-semibold" style="color: rgba(220,220,240,0.9);">{{ value || row.customer_snapshot?.name || '-' }}</span></template>
      <template #cell-delivery_date="{ value, row }"><span style="color: rgba(160,160,192,0.8);">{{ value || row.delivery?.date || '-' }}</span></template>
      <template #cell-total_amount="{ value, row }"><span class="font-semibold" style="color: rgba(230,230,250,0.95);">Rp {{ (value || row.finance?.total_amount || 0).toLocaleString('id-ID') }}</span></template>
      <template #cell-order_status="{ value, row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" :style="statusBadge(value || row.status?.order)">{{ value || row.status?.order || '-' }}</span>
      </template>
      <template #cell-payment_status="{ value, row }">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" :style="payBadge(value || row.status?.payment)">{{ value || row.status?.payment || '-' }}</span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '../../components/admin/DataTable.vue'
import { orderApi } from '../../api/apiService'

const router = useRouter()
const loading = ref(false), data = ref([]), meta = ref(null)
const search = ref(''), perPage = ref(10)
const filterOrderStatus = ref('')
const filterPaymentStatus = ref('')

const columns = [
  { key: 'invoice_number', label: 'Invoice' },
  { key: 'customer_name', label: 'Pelanggan' },
  { key: 'delivery_date', label: 'Tanggal' },
  { key: 'order_status', label: 'Status Order' },
  { key: 'payment_status', label: 'Pembayaran' },
  { key: 'total_amount', label: 'Total' }
]

const statusBadge = (s) => {
  if (s === 'completed') return { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
  if (s === 'processing') return { background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }
  if (s === 'pending') return { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }
  if (s === 'canceled') return { background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
  return { background: 'rgba(255,255,255,0.05)', color: 'rgba(160,160,192,0.8)' }
}
const payBadge = (s) => {
  if (s === 'paid') return { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
  if (s === 'dp_received') return { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }
  if (s === 'unpaid') return { background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
  return { background: 'rgba(255,255,255,0.05)', color: 'rgba(160,160,192,0.8)' }
}

const fetchData = async (p = 1) => {
  loading.value = true
  try { 
    const r = await orderApi.getAll(p, perPage.value, search.value, filterOrderStatus.value, filterPaymentStatus.value)
    if (r.status === 'success') { data.value = r.data; meta.value = r.meta } 
  } finally { loading.value = false }
}
const onSearch = () => fetchData(1)

const viewOrder = (row) => {
  router.push({ name: 'AdminOrderDetail', params: { id: row.id } })
}

onMounted(() => fetchData())
</script>
