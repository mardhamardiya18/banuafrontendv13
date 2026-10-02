<template>
  <section class="expense-summary rounded-2xl p-6 space-y-5" aria-labelledby="expense-heading" :aria-busy="loading">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 id="expense-heading" class="text-base font-bold text-white">Ringkasan Pengeluaran</h2>
        <p class="text-xs text-gray-400 mt-1">Total kas keluar berdasarkan kategori dan periode pilihan Anda.</p>
      </div>
      <div class="flex flex-wrap gap-1 rounded-xl bg-black/20 p-1" aria-label="Periode pengeluaran">
        <button v-for="option in periods" :key="option.value" type="button" :aria-pressed="period === option.value"
          class="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
          :class="period === option.value ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'"
          @click="period = option.value">{{ option.label }}</button>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <label class="space-y-2 text-xs text-gray-400 font-semibold">
        <span>Kategori pengeluaran</span>
        <select v-model="category" class="expense-input">
          <option value="">Semua kategori pengeluaran</option>
          <option v-for="name in categoryOptions" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>
      <label v-if="period !== 'all'" class="space-y-2 text-xs text-gray-400 font-semibold">
        <span>{{ period === 'month' ? 'Pilih bulan' : 'Pilih tahun' }}</span>
        <input v-if="period === 'month'" v-model="month" type="month" class="expense-input" />
        <input v-else v-model="year" type="number" min="1000" max="9999" step="1" class="expense-input" />
      </label>
    </div>

    <p v-if="!range" class="text-sm text-amber-300" role="status">Pilih periode yang valid untuk melihat pengeluaran.</p>
    <div v-else-if="error" class="text-sm text-rose-300" role="alert">
      Ringkasan pengeluaran gagal dimuat.
      <button class="underline ml-2" @click="loadSummary">Coba lagi</button>
    </div>
    <div v-else-if="loading" class="space-y-3 animate-pulse" role="status" aria-label="Memuat ringkasan pengeluaran">
      <div class="h-24 rounded-xl bg-white/5"></div><div class="h-12 rounded-xl bg-white/5"></div>
    </div>
    <template v-else>
      <div class="expense-total rounded-xl p-5 flex flex-wrap items-center justify-between gap-4" aria-live="polite">
        <div class="min-w-0">
          <p class="text-xs text-gray-300">{{ category || 'Semua kategori pengeluaran' }} · {{ periodLabel }}</p>
          <p class="text-3xl font-bold text-rose-400 mt-2 break-words">{{ currency(selectedTotal) }}</p>
          <p class="text-xs text-gray-400 mt-2">{{ category ? `${share(selectedTotal)}% dari total pengeluaran periode ini` : `${rows.length} kategori dengan transaksi pengeluaran` }}</p>
        </div>
        <button type="button" class="text-xs font-semibold rounded-xl border border-purple-400/30 px-4 py-2.5 text-purple-300 hover:bg-purple-500/10"
          @click="showTransactions(category)">Lihat transaksi</button>
      </div>
      <p v-if="visibleRows.length === 0" class="text-sm text-gray-400 py-3 text-center">Belum ada pengeluaran{{ category ? ` untuk ${category}` : '' }} pada periode ini.</p>
      <div v-else class="grid md:grid-cols-2 gap-3">
        <button v-for="row in visibleRows" :key="row.category" type="button" class="text-left rounded-xl border border-white/5 p-4 hover:bg-white/5 transition-colors"
          :aria-label="`Lihat transaksi ${row.category}`" @click="showTransactions(row.category)">
          <div class="flex flex-wrap justify-between gap-2 text-sm">
            <span class="text-gray-300">{{ row.category }}</span><strong class="text-white">{{ currency(row.amount) }}</strong>
          </div>
          <div class="h-1.5 rounded-full bg-white/5 mt-3 overflow-hidden"><div class="h-full bg-purple-400 rounded-full" :style="{ width: `${share(row.amount)}%` }"></div></div>
          <p class="text-xs text-gray-500 mt-2">{{ share(row.amount) }}% dari pengeluaran periode ini</p>
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { financeApi } from '../../api/apiService'
import { expenseDateRange } from '../../utils/expenseSummary'

const props = defineProps({ categories: { type: Array, default: () => [] }, refreshKey: { type: Number, default: 0 } })
const emit = defineEmits(['view-transactions'])
const today = new Date()
const period = ref('month')
const month = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)
const year = ref(today.getFullYear())
const category = ref('')
const periods = [{ value: 'month', label: 'Bulanan' }, { value: 'year', label: 'Tahunan' }, { value: 'all', label: 'Keseluruhan' }]
const rows = ref([])
const total = ref(0)
const loading = ref(true)
const error = ref(false)
let requestId = 0
const range = computed(() => expenseDateRange(period.value, month.value, year.value))
const categoryOptions = computed(() => [...new Set([...props.categories, ...rows.value.map(row => row.category)])].sort((a, b) => a.localeCompare(b, 'id')))
const visibleRows = computed(() => category.value ? rows.value.filter(row => row.category === category.value) : rows.value)
const selectedTotal = computed(() => category.value ? visibleRows.value.reduce((sum, row) => sum + Number(row.amount), 0) : total.value)
const periodLabel = computed(() => period.value === 'all' ? 'Keseluruhan' : period.value === 'year' ? `Tahun ${year.value}` : new Date(`${month.value}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }))
const currency = value => `Rp ${Number(value).toLocaleString('id-ID')}`
const share = value => total.value > 0 ? Math.round(Number(value) / total.value * 10000) / 100 : 0
const showTransactions = selectedCategory => emit('view-transactions', { category: selectedCategory, start_date: range.value.start, end_date: range.value.end })

async function loadSummary() {
  const id = ++requestId
  error.value = false
  if (!range.value) { loading.value = false; return }
  loading.value = true
  try {
    const res = await financeApi.getPnl(period.value === 'all' ? 'all_time' : 'custom', range.value.start, range.value.end)
    if (id !== requestId) return
    if (res.status !== 'success' || !Array.isArray(res.data?.biaya_operasional?.rincian)) throw new Error('Invalid expense summary')
    rows.value = res.data.biaya_operasional.rincian
    total.value = Number(res.data.biaya_operasional.total_biaya)
  } catch {
    if (id === requestId) error.value = true
  } finally {
    if (id === requestId) loading.value = false
  }
}
watch([range, () => props.refreshKey], loadSummary, { immediate: true })
</script>

<style scoped>
.expense-summary { background: rgba(20,20,32,.8); border: 1px solid rgba(255,255,255,.06); }
.expense-total { background: linear-gradient(110deg, rgba(244,63,94,.09), rgba(139,92,246,.06)); border: 1px solid rgba(244,63,94,.13); }
.expense-input { display: block; width: 100%; background: #141420; border: 1px solid #ffffff1a; border-radius: 12px; padding: 10px 12px; color: #e0e0ef; font-size: 14px; color-scheme: dark; }
.expense-input:focus { outline: 2px solid #a78bfa; outline-offset: 2px; }
</style>
