<template>
  <div class="space-y-8 text-[#e0e0ef]">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Ringkasan Keuangan</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">
          Analisis pendapatan, pengeluaran, laba rugi, dan arus kas usaha Anda.
        </p>
      </div>

      <!-- Filters -->
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
          <option value="this_year">Tahun Ini</option>
          <option value="all_time">Semua Waktu</option>
          <option value="custom">Kustom Tanggal</option>
        </select>

        <!-- Custom Date Range -->
        <transition name="fade">
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
        </transition>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Card Widget: Total Pendapatan -->
      <div
        class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
      >
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(52,211,153,0.08);"></div>
        <div class="flex items-start justify-between mb-5 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/12 border border-emerald-500/20">
            <TrendingUp :size="22" class="text-emerald-400" />
          </div>
          <span
            v-if="cards.total_pendapatan.trend !== 0"
            class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            :style="cards.total_pendapatan.trend >= 0
              ? 'background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2);'
              : 'background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2);'"
          >
            {{ cards.total_pendapatan.trend >= 0 ? '+' : '' }}{{ cards.total_pendapatan.trend }}%
          </span>
        </div>
        <div class="relative z-10">
          <div v-if="loading" class="h-7 rounded-lg animate-pulse bg-white/5 w-2/3 mb-1.5"></div>
          <p v-else class="text-2xl font-bold text-white">{{ formatCurrency(cards.total_pendapatan.value) }}</p>
          <p class="text-sm font-medium mt-0.5 text-gray-400">Total Pendapatan</p>
          <p v-if="!loading" class="text-[10px] mt-2 text-gray-500">
            Order: {{ formatCurrency(cards.total_pendapatan.from_orders) }} • Manual: {{ formatCurrency(cards.total_pendapatan.manual) }}
          </p>
        </div>
      </div>

      <!-- Card Widget: Total Pengeluaran -->
      <div
        class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
      >
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(248,113,113,0.08);"></div>
        <div class="flex items-start justify-between mb-5 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-rose-500/12 border border-rose-500/20">
            <TrendingDown :size="22" class="text-rose-400" />
          </div>
          <span
            v-if="cards.total_pengeluaran.trend !== 0"
            class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            :style="cards.total_pengeluaran.trend <= 0
              ? 'background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2);'
              : 'background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2);'"
          >
            {{ cards.total_pengeluaran.trend > 0 ? '+' : '' }}{{ cards.total_pengeluaran.trend }}%
          </span>
        </div>
        <div class="relative z-10">
          <div v-if="loading" class="h-7 rounded-lg animate-pulse bg-white/5 w-2/3 mb-1.5"></div>
          <p v-else class="text-2xl font-bold text-white">{{ formatCurrency(cards.total_pengeluaran.value) }}</p>
          <p class="text-sm font-medium mt-0.5 text-gray-400">Total Pengeluaran</p>
          <p v-if="!loading" class="text-[10px] mt-2 text-gray-500">
            HPP: {{ formatCurrency(cards.total_pengeluaran.hpp) }} • Ops: {{ formatCurrency(cards.total_pengeluaran.operasional) }}
          </p>
        </div>
      </div>

      <!-- Card Widget: Laba Bersih -->
      <div
        class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
      >
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(139,92,246,0.08);"></div>
        <div class="flex items-start justify-between mb-5 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/12 border border-purple-500/20">
            <Coins :size="22" class="text-purple-400" />
          </div>
          <span
            v-if="cards.laba_bersih.trend !== 0"
            class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            :style="cards.laba_bersih.trend >= 0
              ? 'background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2);'
              : 'background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2);'"
          >
            {{ cards.laba_bersih.trend >= 0 ? '+' : '' }}{{ cards.laba_bersih.trend }}%
          </span>
        </div>
        <div class="relative z-10">
          <div v-if="loading" class="h-7 rounded-lg animate-pulse bg-white/5 w-2/3 mb-1.5"></div>
          <p v-else class="text-2xl font-bold text-white">{{ formatCurrency(cards.laba_bersih.value) }}</p>
          <p class="text-sm font-medium mt-0.5 text-gray-400">Laba Bersih</p>
          <p v-if="!loading" class="text-[10px] mt-2" :class="cards.laba_bersih.value >= 0 ? 'text-emerald-400/80' : 'text-rose-400/80'">
            {{ cards.laba_bersih.value >= 0 ? 'Untung' : 'Rugi' }} pada periode ini
          </p>
        </div>
      </div>

      <!-- Card Widget: Saldo Kas Saat Ini -->
      <div
        class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
      >
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(245,158,11,0.08);"></div>
        <div class="flex items-start justify-between mb-5 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/12 border border-amber-500/20">
            <Landmark :size="22" class="text-amber-400" />
          </div>
        </div>
        <div class="relative z-10">
          <div v-if="loading" class="h-7 rounded-lg animate-pulse bg-white/5 w-2/3 mb-1.5"></div>
          <p v-else class="text-2xl font-bold text-white">{{ formatCurrency(cards.saldo_kas_saat_ini.value) }}</p>
          <p class="text-sm font-medium mt-0.5 text-gray-400">Saldo Kas Saat Ini</p>
          <p v-if="!loading" class="text-[10px] mt-2 text-gray-500">
            Kas Masuk: {{ formatCurrency(cards.saldo_kas_saat_ini.total_in) }} • Kas Keluar: {{ formatCurrency(cards.saldo_kas_saat_ini.total_out) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Chart: Cash Flow -->
    <div class="rounded-2xl p-6 transition-all duration-300"
         style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 class="text-base font-bold text-white">Arus Kas Masuk vs Keluar</h3>
          <p class="text-sm mt-0.5 text-gray-500">Bandingkan pemasukan dan total biaya operasional + HPP</p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <!-- Chart Type Selector -->
          <div class="flex bg-[#141420] border border-white/5 rounded-lg p-0.5">
            <button
              v-for="mode in availableChartModes"
              :key="mode.id"
              @click="chartMode = mode.id"
              class="px-2.5 py-1 rounded-md transition-all duration-150"
              :class="chartMode === mode.id ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-[#e0e0ef]'"
            >
              {{ mode.label }}
            </button>
          </div>
          <div class="hidden sm:flex items-center gap-4">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="text-gray-400">Pemasukan</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span>
              <span class="text-gray-400">Pengeluaran</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="h-[320px] rounded-xl animate-pulse bg-white/4"></div>
      <div v-else class="h-[320px]">
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js'
import {
  TrendingUp, TrendingDown, Coins, Landmark
} from '@lucide/vue'
import { financeApi } from '../../../api/apiService'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const loading = ref(true)
const filter = ref('this_month')
const startDate = ref('')
const endDate = ref('')
const chartMode = ref('daily') // 'daily', 'weekly', 'monthly'

const cards = ref({
  total_pendapatan: { value: 0, trend: 0, from_orders: 0, manual: 0 },
  total_pengeluaran: { value: 0, trend: 0, operasional: 0, hpp: 0 },
  laba_bersih: { value: 0, trend: 0 },
  saldo_kas_saat_ini: { value: 0, total_in: 0, total_out: 0 }
})

const rawCharts = ref({
  daily_chart: [],
  weekly_chart: [],
  monthly_chart: []
})

// Compute modes that can be selected based on date range / preset
const availableChartModes = computed(() => {
  const modes = []
  if (rawCharts.value.daily_chart?.length > 0) {
    modes.push({ id: 'daily', label: 'Harian' })
  }
  if (rawCharts.value.weekly_chart?.length > 0) {
    modes.push({ id: 'weekly', label: 'Mingguan' })
  }
  if (rawCharts.value.monthly_chart?.length > 0) {
    modes.push({ id: 'monthly', label: 'Bulanan' })
  }
  return modes
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
    const res = await financeApi.getOverview(filter.value, startDate.value, endDate.value)
    if (res.status === 'success') {
      cards.value = res.data.cards
      rawCharts.value = res.data.charts
      
      // Auto assign chartMode to the best available
      if (rawCharts.value.daily_chart?.length > 0) {
        chartMode.value = 'daily'
      } else if (rawCharts.value.weekly_chart?.length > 0) {
        chartMode.value = 'weekly'
      } else if (rawCharts.value.monthly_chart?.length > 0) {
        chartMode.value = 'monthly'
      }
    }
  } catch (error) {
    console.error('Error fetching overview finance:', error)
  } finally {
    loading.value = false
  }
}

// ChartJS Configuration
const barChartData = computed(() => {
  let labels = []
  let incoming = []
  let outgoing = []

  if (chartMode.value === 'daily') {
    const daily = rawCharts.value.daily_chart || []
    labels = daily.map(d => d.label)
    incoming = daily.map(d => d.pemasukan)
    outgoing = daily.map(d => d.pengeluaran)
  } else if (chartMode.value === 'weekly') {
    const weekly = rawCharts.value.weekly_chart || []
    labels = weekly.map(w => w.label)
    incoming = weekly.map(w => w.pemasukan)
    outgoing = weekly.map(w => w.pengeluaran)
  } else if (chartMode.value === 'monthly') {
    const monthly = rawCharts.value.monthly_chart || []
    labels = monthly.map(m => m.label)
    incoming = monthly.map(m => m.pemasukan)
    outgoing = monthly.map(m => m.pengeluaran)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: incoming,
        backgroundColor: 'rgba(52, 211, 153, 0.75)',
        hoverBackgroundColor: 'rgba(52, 211, 153, 0.95)',
        borderRadius: 8,
        barThickness: 16
      },
      {
        label: 'Pengeluaran',
        data: outgoing,
        backgroundColor: 'rgba(244, 63, 94, 0.75)',
        hoverBackgroundColor: 'rgba(244, 63, 94, 0.95)',
        borderRadius: 8,
        barThickness: 16
      }
    ]
  }
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#141420',
      titleColor: 'rgba(224,224,239,0.9)',
      bodyColor: 'rgba(160,160,192,0.8)',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: 'rgba(160,160,192,0.5)', font: { size: 10 } }
    },
    y: {
      border: { display: false, dash: [4, 4] },
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: 'rgba(160,160,192,0.5)',
        font: { size: 10 },
        callback: (v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}jt` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}rb` : v
      }
    }
  }
}

const formatCurrency = (val) => {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
