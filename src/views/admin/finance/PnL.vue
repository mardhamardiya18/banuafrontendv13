<template>
  <div class="space-y-8 text-[#e0e0ef] print:text-black print:bg-white print:space-y-4">
    <!-- Page Header (hidden in print) -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Laporan Laba Rugi (P&L)</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">
          Laporan rekapitulasi margin kotor dan laba bersih operasional.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Date Presets -->
        <select
          v-model="filter"
          @change="handleFilterChange"
          class="bg-[#141420] border border-white/10 rounded-xl px-4 py-2 text-sm text-[#e0e0ef] focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="today">Hari Ini</option>
          <option value="this_week">Minggu Ini</option>
          <option value="this_month">Bulan Ini</option>
          <option value="last_month">Bulan Lalu</option>
          <option value="this_year">Tahun Ini</option>
          <option value="custom">Kustom Tanggal</option>
        </select>

        <!-- Custom Date Range -->
        <div v-if="filter === 'custom'" class="flex items-center gap-2">
          <input
            type="date"
            v-model="startDate"
            class="bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <span class="text-xs text-gray-500">s/d</span>
          <input
            type="date"
            v-model="endDate"
            class="bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            @click="fetchData"
            class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200"
          >
            Terapkan
          </button>
        </div>

        <button
          @click="printReport"
          class="bg-[#141420] hover:bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Printer :size="15" />
          Cetak Laporan
        </button>

        <button
          @click="downloadExcel"
          :disabled="isDownloadingExcel"
          class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <FileSpreadsheet :size="15" />
          {{ isDownloadingExcel ? 'Mengunduh Excel...' : 'Download Excel (.xlsx)' }}
        </button>

        <button
          @click="downloadPdf"
          :disabled="isDownloadingPdf"
          class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <FileText :size="15" />
          {{ isDownloadingPdf ? 'Mengunduh PDF...' : 'Download PDF (.pdf)' }}
        </button>
      </div>
    </div>

    <!-- P&L Sheet -->
    <div
      class="rounded-2xl p-6 md:p-8 space-y-8 print:border-none print:p-0"
      style="background: rgba(20,20,32,0.85); border: 1px solid rgba(255,255,255,0.06);"
    >
      <!-- Sheet Header -->
      <div class="text-center pb-6 border-b border-white/5 print:border-black/10">
        <h2 class="text-xl font-bold tracking-tight text-white print:text-black">LAPORAN LABA RUGI (P&L)</h2>
        <p class="text-sm font-bold text-purple-400 mt-1 uppercase tracking-wider print:text-purple-700">DMI CATERING &amp; BANUA BANJARBARU</p>
        <p class="text-xs text-gray-400 mt-2 font-semibold print:text-gray-600">
          Periode: {{ formattedPeriod }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6 py-10 animate-pulse">
        <div v-for="n in 5" :key="n" class="flex justify-between items-center">
          <div class="h-4 bg-white/5 rounded w-1/3"></div>
          <div class="h-4 bg-white/5 rounded w-1/4"></div>
        </div>
      </div>

      <!-- Financial Statement Rows -->
      <div v-else class="space-y-6 text-sm">
        <!-- 1. PENDAPATAN -->
        <div class="space-y-2">
          <div class="flex justify-between items-center font-bold text-base text-white border-b border-white/5 pb-1 print:text-black print:border-black/10">
            <span>1. PENDAPATAN</span>
            <span>{{ formatCurrency(pnlData.pendapatan.total_pendapatan) }}</span>
          </div>
          <div class="pl-4 space-y-1.5 text-gray-300 print:text-gray-800">
            <div class="flex justify-between items-center">
              <span>Pendapatan Penjualan Catering (Otomatis)</span>
              <span>{{ formatCurrency(pnlData.pendapatan.pendapatan_penjualan) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Pendapatan Lain-lain (Manual)</span>
              <span>{{ formatCurrency(pnlData.pendapatan.pendapatan_lainnya) }}</span>
            </div>

            <!-- Revenue Details Collapsible -->
            <div class="mt-2 pt-2 border-t border-white/5 pl-2 print:border-black/5">
              <button
                @click="showRevenueDetails = !showRevenueDetails"
                class="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2 print:hidden"
              >
                <component :is="showRevenueDetails ? ChevronDown : ChevronRight" :size="12" />
                {{ showRevenueDetails ? 'Sembunyikan Kategori Pendapatan' : 'Tampilkan Kategori Pendapatan' }}
              </button>
              <div v-if="showRevenueDetails || isPrinting" class="space-y-1 pl-4 text-xs text-gray-400 print:text-gray-600">
                <div v-for="row in pnlData.pendapatan.rincian" :key="row.category" class="flex justify-between items-center">
                  <span>{{ row.category }} ({{ row.percentage }}%)</span>
                  <span>{{ formatCurrency(row.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. HPP (Bahan Baku) -->
        <div class="space-y-2">
          <div class="flex justify-between items-center font-bold text-base text-white border-b border-white/5 pb-1 print:text-black print:border-black/10">
            <span>2. HARGA POKOK PENJUALAN (HPP)</span>
            <span class="text-rose-400 print:text-rose-700">({{ formatCurrency(pnlData.hpp.total_hpp) }})</span>
          </div>
          <div class="pl-4 space-y-1.5 text-gray-300 print:text-gray-800">
            <div class="flex justify-between items-center">
              <span>Total Biaya Bahan Baku &amp; Menu Pokok</span>
              <span class="text-rose-400/90 print:text-rose-700">({{ formatCurrency(pnlData.hpp.total_hpp) }})</span>
            </div>

            <!-- HPP Products details -->
            <div class="mt-2 pt-2 border-t border-white/5 pl-2 print:border-black/5">
              <button
                @click="showHppDetails = !showHppDetails"
                class="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2 print:hidden"
              >
                <component :is="showHppDetails ? ChevronDown : ChevronRight" :size="12" />
                {{ showHppDetails ? 'Sembunyikan Rincian HPP per Produk' : 'Tampilkan Rincian HPP per Produk' }}
              </button>
              <div v-if="showHppDetails || isPrinting" class="space-y-1 pl-4 text-xs text-gray-400 print:text-gray-600">
                <div v-for="row in pnlData.hpp.rincian_produk" :key="row.product_id" class="flex justify-between items-center">
                  <span>{{ row.name }} (x{{ row.total_qty }} porsi) ({{ row.percentage }}%)</span>
                  <span>{{ formatCurrency(row.total_cost) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. LABA KOTOR -->
        <div class="py-3 px-4 rounded-xl flex justify-between items-center font-bold text-base print:border-t print:border-b print:border-black/10"
             style="background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px double rgba(255,255,255,0.15);">
          <span class="text-white print:text-black">3. LABA KOTOR (GROSS PROFIT)</span>
          <div class="text-right">
            <span :class="pnlData.laba_kotor.value >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-rose-700'">
              {{ formatCurrency(pnlData.laba_kotor.value) }}
            </span>
            <p class="text-[10px] text-gray-400 mt-0.5 print:text-gray-600">Margin Kotor: {{ pnlData.laba_kotor.margin_percentage }}%</p>
          </div>
        </div>

        <!-- 4. BIAYA OPERASIONAL -->
        <div class="space-y-2">
          <div class="flex justify-between items-center font-bold text-base text-white border-b border-white/5 pb-1 print:text-black print:border-black/10">
            <span>4. BIAYA OPERASIONAL (PENGELUARAN KAS)</span>
            <span class="text-rose-400 print:text-rose-700">({{ formatCurrency(pnlData.biaya_operasional.total_biaya) }})</span>
          </div>
          <div class="pl-4 space-y-1.5 text-gray-300 print:text-gray-800">
            <div v-for="row in pnlData.biaya_operasional.rincian" :key="row.category" class="flex justify-between items-center">
              <span>{{ row.category }} ({{ row.percentage }}%)</span>
              <span class="text-rose-400/80 print:text-rose-700">({{ formatCurrency(row.amount) }})</span>
            </div>
            <div v-if="pnlData.biaya_operasional.rincian.length === 0" class="text-xs text-gray-500 py-1">
              Tidak ada rincian biaya operasional di periode ini.
            </div>
          </div>
        </div>

        <!-- 5. LABA BERSIH -->
        <div class="py-4 px-4 rounded-xl flex justify-between items-center font-black text-lg print:border-b-2 print:border-black"
             :style="pnlData.laba_bersih.value >= 0
               ? 'background: rgba(52,211,153,0.06); border: 2px solid rgba(52,211,153,0.15);'
               : 'background: rgba(244,63,94,0.06); border: 2px solid rgba(244,63,94,0.15);'"
        >
          <span class="text-white print:text-black">5. LABA BERSIH (NET PROFIT)</span>
          <div class="text-right">
            <span :class="pnlData.laba_bersih.value >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-rose-700'">
              {{ formatCurrency(pnlData.laba_bersih.value) }}
            </span>
            <p class="text-xs text-gray-400 mt-0.5 print:text-gray-600">Margin Bersih: {{ pnlData.laba_bersih.margin_percentage }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Printer, ChevronDown, ChevronRight, FileText, FileSpreadsheet } from '@lucide/vue'
import { financeApi } from '../../../api/apiService'

const loading = ref(true)
const filter = ref('this_month')
const startDate = ref('')
const endDate = ref('')

const showRevenueDetails = ref(false)
const showHppDetails = ref(false)
const isPrinting = ref(false)
const isDownloadingPdf = ref(false)
const isDownloadingExcel = ref(false)

const pnlData = ref({
  filter: 'this_month',
  period: { start_date: null, end_date: null },
  pendapatan: { total_pendapatan: 0, pendapatan_penjualan: 0, pendapatan_lainnya: 0, rincian: [] },
  hpp: { total_hpp: 0, rincian_produk: [] },
  laba_kotor: { value: 0, margin_percentage: 0 },
  biaya_operasional: { total_biaya: 0, rincian: [] },
  laba_bersih: { value: 0, margin_percentage: 0 }
})

const formattedPeriod = computed(() => {
  if (!pnlData.value.period.start_date || !pnlData.value.period.end_date) {
    return 'Semua Waktu'
  }
  const start = new Date(pnlData.value.period.start_date)
  const end = new Date(pnlData.value.period.end_date)
  
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  return `${start.toLocaleDateString('id-ID', options)} s/d ${end.toLocaleDateString('id-ID', options)}`
})

const handleFilterChange = () => {
  if (filter.value !== 'custom') {
    startDate.value = ''
    endDate.value = ''
    fetchData()
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await financeApi.getPnl(filter.value, startDate.value, endDate.value)
    if (res.status === 'success') {
      pnlData.value = res.data
    }
  } catch (error) {
    console.error('Error fetching P&L data:', error)
  } finally {
    loading.value = false
  }
}

const downloadExcel = async () => {
  isDownloadingExcel.value = true
  try {
    await financeApi.exportExcel(filter.value, startDate.value, endDate.value)
  } finally {
    isDownloadingExcel.value = false
  }
}

const downloadPdf = async () => {
  isDownloadingPdf.value = true
  try {
    await financeApi.exportPdf(filter.value, startDate.value, endDate.value)
  } finally {
    isDownloadingPdf.value = false
  }
}

const printReport = () => {
  isPrinting.value = true
  // Let DOM update
  setTimeout(() => {
    window.print()
    isPrinting.value = false
  }, 100)
}

const formatCurrency = (val) => {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

onMounted(() => {
  fetchData()
})
</script>

<style>
@media print {
  body {
    background-color: white !important;
    color: black !important;
  }
  .print\:hidden {
    display: none !important;
  }
  .print\:text-black {
    color: black !important;
  }
  .print\:bg-white {
    background-color: white !important;
  }
  .print\:border-black\/10 {
    border-color: rgba(0, 0, 0, 0.1) !important;
  }
  .print\:border-black\/5 {
    border-color: rgba(0, 0, 0, 0.05) !important;
  }
  .print\:text-emerald-700 {
    color: #047857 !important;
  }
  .print\:text-rose-700 {
    color: #be123c !important;
  }
  .print\:text-purple-700 {
    color: #6d28d9 !important;
  }
  .print\:text-gray-600 {
    color: #4b5563 !important;
  }
  .print\:text-gray-800 {
    color: #1f2937 !important;
  }
}
</style>
