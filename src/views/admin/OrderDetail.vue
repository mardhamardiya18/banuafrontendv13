<template>
  <div class="h-full flex flex-col min-h-0 bg-[#0a0a0f] text-gray-100">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0 mb-5">
      <div class="flex items-center gap-4">
        <router-link :to="{ name: 'AdminOrders' }" class="w-10 h-10 flex items-center justify-center rounded-xl transition-colors shadow-sm"
                     style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(160,160,192,0.8);"
                     onmouseenter="this.style.background='rgba(255,255,255,0.1)';"
                     onmouseleave="this.style.background='rgba(255,255,255,0.05)';">
          <i class="bx bx-arrow-back text-xl"></i>
        </router-link>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold leading-tight" style="color: rgba(224,224,239,0.95);">Detail Pesanan</h1>
          <p class="text-xs sm:text-sm font-mono mt-0.5" style="color: rgba(160,160,192,0.6);">{{ detail?.invoice_number || 'Memuat...' }}</p>
        </div>
      </div>
      <div class="hidden sm:flex gap-3 items-center">
        <span v-if="detail" class="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider" :style="statusBadge(detail.status?.order)">Order: {{ detail.status?.order }}</span>
        <span v-if="detail" class="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider" :style="payBadge(detail.status?.payment)">Payment: {{ detail.status?.payment }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center space-y-4">
       <i class="bx bx-loader-alt bx-spin text-4xl" style="color: #a78bfa;"></i>
       <p style="color: rgba(160,160,192,0.6);">Memuat detail pesanan...</p>
    </div>

    <!-- Content Layout -->
    <div v-else-if="detail" class="flex flex-col lg:flex-row gap-5 flex-1 min-h-0 overflow-hidden">
      
      <!-- LEFT: Customer & Actions -->
      <div class="flex-[2] flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-1">
        <!-- Customer Details -->
        <div class="rounded-2xl shadow-sm p-5" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
          <h3 class="text-sm font-bold mb-4 flex items-center gap-2" style="color: rgba(220,220,240,0.9);"><i class="bx bx-user-circle text-lg" style="color: #a78bfa;"></i> Info Pelanggan & Pengiriman</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="info in orderInfo" :key="info.label" class="rounded-xl p-3.5"
                 style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);">
              <p class="text-[10px] font-bold uppercase tracking-wider mb-1" style="color: rgba(160,160,192,0.5);">{{ info.label }}</p>
              <template v-if="info.label === 'Maps' && info.value !== '-'">
                <a :href="getMapUrl(info.value)" target="_blank" class="text-sm font-medium hover:underline flex items-start gap-1.5 break-all"
                   style="color: #60a5fa;">
                  <i class="bx bx-map mt-0.5"></i> Buka di Maps
                </a>
              </template>
              <p v-else class="text-sm font-semibold" style="color: rgba(220,220,240,0.9);">{{ info.value }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-4" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
          <button @click="openStatusModal" class="flex-1 font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-2"
                  style="background: rgba(255,255,255,0.05); color: rgba(220,220,240,0.9); border: 1px solid rgba(255,255,255,0.1);"
                  onmouseenter="this.style.background='rgba(255,255,255,0.1)';"
                  onmouseleave="this.style.background='rgba(255,255,255,0.05)';">
            <i class="bx bx-edit text-lg"></i> Update Status
          </button>
          <button @click="handleDownloadInvoice" :disabled="downloading" class="flex-1 font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
                  style="background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2);"
                  onmouseenter="this.style.background='rgba(139,92,246,0.25)';"
                  onmouseleave="this.style.background='rgba(139,92,246,0.15)';">
            <i class="bx text-lg" :class="downloading ? 'bx-loader-alt animate-spin' : 'bx-download'"></i> Download Invoice
          </button>
        </div>
      </div>

      <!-- RIGHT: Order Items & Totals -->
      <div class="w-full lg:w-[420px] xl:w-[460px] flex flex-col gap-4 shrink-0 h-full min-h-0">
        <!-- Order Items List -->
        <div class="flex-[3] rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[300px]"
             style="background: #0a0a0f; border: 1px solid rgba(255,255,255,0.05);">
          <div class="p-4 flex justify-between items-center shrink-0"
               style="background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05);">
            <h2 class="font-bold flex items-center gap-2" style="color: rgba(220,220,240,0.9);"><i class="bx bx-receipt" style="color: #a78bfa;"></i> Daftar Pesanan</h2>
            <span class="px-2 py-0.5 rounded-md text-xs font-bold"
                  style="background: rgba(139,92,246,0.15); color: #a78bfa;">{{ detail.items?.length || 0 }} Menu</span>
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-3 relative custom-scrollbar">
            <div v-for="item in detail.items" :key="item.id" class="rounded-xl overflow-hidden shadow-sm"
                 style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
              <div class="p-3.5 flex justify-between cursor-pointer hover:bg-white/5 transition-colors" @click="toggleItem(item.id)">
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <img v-if="item.package?.thumbnail" :src="item.package.thumbnail" class="w-12 h-12 object-cover rounded-lg shrink-0" style="border: 1px solid rgba(255,255,255,0.1);" alt="" />
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm leading-tight pr-2" style="color: rgba(230,230,250,0.95);">{{ item.package?.name || 'Paket' }}</p>
                    <p class="text-[11px] mt-0.5 font-medium" style="color: rgba(160,160,192,0.6);">{{ item.quantity }} x Rp {{ (item.snapshots?.price || 0).toLocaleString('id-ID') }}</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1 shrink-0">
                  <p class="text-sm font-black" style="color: #a78bfa;">Rp {{ (item.sub_total || 0).toLocaleString('id-ID') }}</p>
                  <i :class="expandedItems.includes(item.id)?'bx bx-chevron-up':'bx bx-chevron-down'" style="color: rgba(160,160,192,0.5);"></i>
                </div>
              </div>
              
              <!-- Expanded item details -->
              <transition name="expand">
                <div v-if="expandedItems.includes(item.id)" class="px-3.5 pb-3.5 space-y-2 border-t border-dashed" style="border-color: rgba(255,255,255,0.1); margin-top: 2px; pt-2;">
                  <div v-if="item.fees?.under_min_order_fee > 0" class="flex justify-between items-center rounded-lg p-2"
                       style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);">
                    <span class="text-[10px] font-semibold flex items-center gap-1" style="color: #fbbf24;"><i class="bx bx-info-circle"></i> Fee Min. Order</span>
                    <span class="text-[10px] font-bold" style="color: #fbbf24;">+ Rp {{ item.fees.under_min_order_fee.toLocaleString('id-ID') }}</span>
                  </div>
                  <div v-if="item.notes" class="text-xs rounded-lg p-2"
                       style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: rgba(190,190,220,0.8);">
                    <span class="font-semibold" style="color: rgba(220,220,240,0.9);">Catatan:</span> {{ item.notes }}
                  </div>
                  <div v-if="item.add_ons?.length">
                    <p class="text-[10px] font-bold uppercase tracking-wider mb-1.5" style="color: rgba(160,160,192,0.5);">Add-ons</p>
                    <div class="space-y-1">
                      <div v-for="a in item.add_ons" :key="a.id" class="flex justify-between text-xs rounded-lg p-2"
                           style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);">
                        <span style="color: rgba(190,190,220,0.8);">{{ a.name }} ({{ a.quantity }}x)</span>
                        <span class="font-semibold" style="color: rgba(220,220,240,0.9);">Rp {{ (a.sub_total || 0).toLocaleString('id-ID') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Totals Panel -->
        <div class="rounded-2xl p-4 flex flex-col justify-between shadow-sm shrink-0" style="background: rgba(139,92,246,0.03); border: 1px solid rgba(255,255,255,0.05);">
          <div class="space-y-2 mb-2">
            <div class="flex justify-between text-sm"><span style="color: rgba(160,160,192,0.7);">Total Amount</span><span class="font-bold" style="color: rgba(220,220,240,0.9);">Rp {{ (detail.finance?.total_amount || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between text-sm"><span style="color: rgba(160,160,192,0.7);">Paid</span><span class="font-bold" style="color: #34d399;">Rp {{ (detail.finance?.paid_amount || 0).toLocaleString('id-ID') }}</span></div>
            <div class="pt-2 mt-2 flex justify-between items-end" style="border-top: 1px solid rgba(255,255,255,0.08);">
              <span class="text-xs font-bold" style="color: rgba(220,220,240,0.9);">Remaining</span>
              <span class="text-xl font-black leading-none" style="color: #f87171;">Rp {{ ((detail.finance?.total_amount || 0) - (detail.finance?.paid_amount || 0)).toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <BaseModal v-model="showStatusModal" title="Update Status Pesanan">
      <div class="space-y-4">
        <div>
          <label class="dark-label">Status Order</label>
          <select v-model="statusForm.order_status" class="dark-select">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div>
          <label class="dark-label">Status Pembayaran</label>
          <select v-model="statusForm.payment_status" class="dark-select">
            <option value="unpaid">Unpaid</option>
            <option value="dp_received">DP Received</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label class="dark-label">Nominal Dibayar (Rp)</label>
          <input type="number" v-model="statusForm.paid_amount" class="dark-input" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showStatusModal=false" class="dark-btn-cancel">Batal</button>
          <button @click="saveStatus" :disabled="updatingStatus" class="dark-btn-primary">
            <i v-if="updatingStatus" class="bx bx-loader-alt animate-spin"></i> Simpan Status
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '../../components/admin/BaseModal.vue'
import { orderApi } from '../../api/apiService'

const route = useRoute()
const loading = ref(true)
const detail = ref(null)
const expandedItems = ref([])

const fetchDetail = async () => {
  loading.value = true
  try {
    const r = await orderApi.getById(route.params.id)
    if (r.status === 'success') detail.value = r.data
  } catch (err) {
    alert('Gagal memuat detail pesanan')
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchDetail())

const toggleItem = (id) => {
  const idx = expandedItems.value.indexOf(id)
  idx === -1 ? expandedItems.value.push(id) : expandedItems.value.splice(idx, 1)
}

const getMapUrl = (val) => {
  if (!val || val === '-') return '#'
  if (val.startsWith('http://') || val.startsWith('https://')) return val
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(val)) return `https://${val}`
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
</script>

<style scoped>
.expand-enter-active { transition: all 0.3s ease; overflow: hidden; }
.expand-leave-active { transition: all 0.2s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 500px; }
</style>
