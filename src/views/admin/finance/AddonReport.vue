<template>
  <div class="space-y-6 text-gray-300">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div><h1 class="text-2xl font-bold text-white">Rekap Add-ons</h1><p class="text-sm text-gray-400 mt-2">Pantau total add-ons yang ditagihkan pada pesanan selesai.</p></div>
      <span class="text-xs font-semibold text-emerald-300 bg-emerald-400/10 rounded-full px-4 py-2">Order completed</span>
    </header>

    <section class="report-panel p-5 sm:p-6 space-y-5" aria-label="Filter rekap add-ons">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-bold text-white">Periode & Add-on</h2>
        <div class="flex flex-wrap gap-1 bg-black/20 rounded-xl p-1">
          <button v-for="option in periods" :key="option.value" type="button" :aria-pressed="period === option.value" @click="period = option.value"
            class="px-4 py-2 rounded-lg text-xs font-semibold" :class="period === option.value ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'">{{ option.label }}</button>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <label class="text-xs font-semibold text-gray-400 space-y-2"><span>Add-on</span>
          <select v-model="addonId" class="report-input"><option value="">Semua add-ons</option><option v-for="addon in options" :key="addon.id" :value="addon.id">{{ optionLabel(addon) }}</option></select>
        </label>
        <label v-if="period !== 'all'" class="text-xs font-semibold text-gray-400 space-y-2"><span>{{ period === 'month' ? 'Pilih bulan' : 'Pilih tahun' }}</span>
          <input v-if="period === 'month'" v-model="month" type="month" class="report-input" />
          <input v-else v-model="year" type="number" min="1000" max="9998" step="1" class="report-input" />
        </label>
      </div>
      <p class="text-xs text-gray-400">Berdasarkan tanggal pengiriman · Harga saat transaksi · {{ periodLabel }}</p>
    </section>

    <p v-if="!validPeriod" role="status" class="text-amber-300 text-sm">Pilih bulan atau tahun yang valid.</p>
    <div v-else-if="error" role="alert" class="report-panel p-6 text-rose-300 text-sm">Rekap add-ons gagal dimuat. <button @click="loadReport" class="underline ml-2">Coba lagi</button></div>
    <div v-else :aria-busy="loading" class="space-y-6">
      <div class="grid sm:grid-cols-3 gap-4" aria-live="polite">
        <article v-for="card in cards" :key="card.label" class="report-panel p-6">
          <p class="text-xs text-gray-400">{{ card.label }}</p>
          <div v-if="loading" class="h-9 w-3/4 bg-white/5 animate-pulse rounded-lg mt-3"></div>
          <p v-else class="text-2xl font-bold mt-3 break-words" :class="card.color">{{ card.value }}</p>
        </article>
      </div>
      <p class="text-xs text-gray-500">Nominal add-ons sudah termasuk dalam total order. Rekap ini tidak menambah pendapatan atau mencatat biaya kurir.</p>

      <section v-if="!loading && report.breakdown.length" class="report-panel p-5 sm:p-6 space-y-4">
        <h2 class="text-base font-bold text-white">Total per Add-on</h2>
        <div class="grid md:grid-cols-2 gap-3">
          <button v-for="row in report.breakdown" :key="row.add_on_id" class="text-left rounded-xl border border-white/10 p-4 hover:bg-white/5" @click="addonId = row.add_on_id">
            <div class="flex flex-wrap justify-between gap-2"><span class="text-sm">{{ addonLabel(row.add_on_id, row.name) }}</span><strong class="text-purple-300">{{ currency(row.total_amount) }}</strong></div>
            <p class="text-xs text-gray-500 mt-2">{{ number(row.total_orders) }} order · {{ number(row.total_quantity) }} unit add-on</p>
          </button>
        </div>
      </section>

      <section class="report-panel overflow-hidden">
        <div class="flex items-center justify-between gap-4 p-6 border-b border-white/5"><h2 class="text-base font-bold text-white">Rincian Add-ons</h2><button @click="loadReport" :disabled="loading" class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40">Muat ulang</button></div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-black/10 text-xs text-gray-400"><tr><th class="p-4">Invoice</th><th class="p-4">Tanggal pengiriman</th><th class="p-4">Add-on</th><th class="p-4 text-right">Kuantitas</th><th class="p-4 text-right">Harga transaksi</th><th class="p-4 text-right">Subtotal</th></tr></thead>
            <tbody class="divide-y divide-white/5">
              <tr v-if="loading"><td colspan="6" class="p-10 text-center text-gray-400" role="status">Memuat rekap add-ons...</td></tr>
              <tr v-else-if="!report.details.length"><td colspan="6" class="p-10 text-center text-gray-400">Belum ada add-on pada order completed untuk filter ini.</td></tr>
              <tr v-else v-for="row in report.details" :key="row.id" class="hover:bg-white/[.02]">
                <td class="p-4"><router-link :to="`/admin/orders/${row.order_id}`" class="text-purple-300 underline">{{ row.invoice_number }}</router-link></td>
                <td class="p-4">{{ deliveryDate(row.delivery_date) }}</td><td class="p-4">{{ addonLabel(row.add_on_id, row.add_on_name) }}</td>
                <td class="p-4 text-right">{{ number(row.quantity) }}</td><td class="p-4 text-right">{{ currency(row.snapshot_price) }}</td><td class="p-4 text-right font-semibold text-white">{{ currency(row.sub_total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!loading && report.meta.total" class="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-white/5 text-xs text-gray-400">
          <span>{{ number(report.meta.total) }} baris add-on · Halaman {{ report.meta.current_page }} dari {{ report.meta.last_page }}</span>
          <div class="flex gap-3"><button :disabled="page <= 1" @click="page--" class="border border-white/10 rounded-lg px-3 py-2 disabled:opacity-30">Sebelumnya</button><button :disabled="page >= report.meta.last_page" @click="page++" class="border border-white/10 rounded-lg px-3 py-2 disabled:opacity-30">Berikutnya</button></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { financeApi } from '../../../api/apiService'
import { expenseDateRange } from '../../../utils/expenseSummary'

const now = new Date()
const period = ref('month')
const month = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
const year = ref(now.getFullYear())
const addonId = ref('')
const page = ref(1)
const options = ref([])
const report = ref({ summary: {}, breakdown: [], details: [], meta: {} })
const loading = ref(true)
const error = ref(false)
let requestId = 0
const periods = [{ value: 'month', label: 'Bulanan' }, { value: 'year', label: 'Tahunan' }, { value: 'all', label: 'Keseluruhan' }]
const validPeriod = computed(() => expenseDateRange(period.value, month.value, year.value) && (period.value !== 'year' || Number(year.value) <= 9998))
const periodLabel = computed(() => !validPeriod.value ? 'Periode belum dipilih' : period.value === 'all' ? 'Keseluruhan' : period.value === 'year' ? `Tahun ${year.value}` : new Date(`${month.value}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }))
const number = value => Number(value || 0).toLocaleString('id-ID')
const currency = value => `Rp ${number(value)}`
const optionLabel = addon => addon.product_name ? `${addon.name} · ${addon.product_name}` : addon.name
const addonLabel = (id, fallback) => { const addon = options.value.find(item => item.id === id); return addon ? optionLabel(addon) : fallback || 'Add-on tidak tersedia' }
const deliveryDate = value => value ? new Date(value.replace(' ', 'T')).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const cards = computed(() => [
  { label: 'Total nominal add-ons', value: currency(report.value.summary.total_amount), color: 'text-purple-300' },
  { label: 'Jumlah order completed', value: number(report.value.summary.total_orders), color: 'text-emerald-300' },
  { label: 'Total kuantitas add-ons', value: number(report.value.summary.total_quantity), color: 'text-white' },
])
async function loadReport() {
  const id = ++requestId
  error.value = false
  if (!validPeriod.value) { loading.value = false; return }
  loading.value = true
  const params = { period: period.value, page: page.value, per_page: 15 }
  if (period.value === 'month') params.month = month.value
  if (period.value === 'year') params.year = year.value
  if (addonId.value) params.add_on_id = addonId.value
  try {
    const res = await financeApi.getAddonReport(params)
    if (id !== requestId) return
    if (res.status !== 'success' || !res.data?.summary || !Array.isArray(res.data.details)) throw new Error('Invalid report')
    report.value = res.data
    options.value = res.data.add_ons
  } catch {
    if (id === requestId) error.value = true
  } finally {
    if (id === requestId) loading.value = false
  }
}
watch([period, month, year, addonId], () => { if (page.value !== 1) page.value = 1; else loadReport() })
watch(page, loadReport)
loadReport()
</script>

<style scoped>
.report-panel { background: rgba(20,20,32,.8); border: 1px solid rgba(255,255,255,.06); border-radius: 18px; }
.report-input { display: block; width: 100%; background: #141420; border: 1px solid #ffffff1a; border-radius: 12px; padding: 10px 12px; color: #e0e0ef; font-size: 14px; color-scheme: dark; }
.report-input:focus { outline: 2px solid #a78bfa; outline-offset: 2px; }
</style>
