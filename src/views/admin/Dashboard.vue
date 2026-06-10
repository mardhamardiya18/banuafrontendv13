<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Dashboard</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">
          Selamat datang kembali! Berikut ringkasan bisnis Anda.
        </p>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
           style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: rgba(160,160,192,0.6);">
        <CalendarDays :size="15" style="color: rgba(139,92,246,0.7);" />
        {{ currentDate }}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="card in statCards"
        :key="card.title"
        class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
        @mouseenter="e => e.currentTarget.style.borderColor='rgba(139,92,246,0.2)'"
        @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'"
      >
        <!-- Background glow -->
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             :style="{ background: card.glowColor }"></div>

        <div class="flex items-start justify-between mb-5 relative z-10">
          <!-- Icon -->
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
               :style="{ background: card.iconBg, border: `1px solid ${card.iconBorder}` }">
            <component :is="card.icon" :size="22" :style="{ color: card.iconColor }" />
          </div>
          <!-- Trend badge -->
          <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                :style="card.change >= 0
                  ? 'background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2);'
                  : 'background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2);'">
            <component :is="card.change >= 0 ? TrendingUp : TrendingDown" :size="12" />
            {{ card.change >= 0 ? '+' : '' }}{{ card.change }}%
          </span>
        </div>

        <div class="relative z-10">
          <div v-if="loading" class="h-7 rounded-lg animate-pulse w-2/3 mb-1.5"
               style="background: rgba(255,255,255,0.07);"></div>
          <p v-else class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">{{ card.value }}</p>
          <p class="text-sm font-medium mt-0.5" style="color: rgba(160,160,192,0.55);">{{ card.title }}</p>
        </div>

        <!-- Bottom line accent -->
        <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             :style="{ background: `linear-gradient(90deg, transparent, ${card.iconColor}, transparent)` }"></div>
      </div>
    </div>

    <!-- Calendar Row -->
    <div class="rounded-2xl p-6 transition-all duration-300" style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-base font-bold" style="color: rgba(224,224,239,0.95);">Jadwal Pengiriman Minggu Ini</h3>
          <p class="text-sm mt-0.5" style="color: rgba(160,160,192,0.55);">Data order yang dijadwalkan (Senin - Minggu)</p>
        </div>
      </div>
      <div v-if="loading" class="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
        <div v-for="n in 7" :key="n" class="min-w-[120px] flex-1 h-24 rounded-xl animate-pulse" style="background: rgba(255,255,255,0.04);"></div>
      </div>
      <div v-else class="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
        <div v-for="day in weekDays" :key="day.dateStr" 
             class="min-w-[130px] flex-1 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 relative"
             :style="day.dateStr === todayStr ? 'background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3);' : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);'"
             @click="openDayModal(day)">
          <div class="text-xs font-bold uppercase tracking-wider mb-1" :style="day.dateStr === todayStr ? 'color: #a78bfa;' : 'color: rgba(160,160,192,0.6);'">{{ day.dayName }}</div>
          <div class="text-xl font-black mb-2" :style="day.dateStr === todayStr ? 'color: white;' : 'color: rgba(224,224,239,0.9);'">{{ day.dateNum }}</div>
          <div v-if="day.orders.length > 0">
            <div class="flex flex-col gap-1">
              <div v-for="order in day.orders.slice(0,2)" :key="order.id" class="text-[10px] font-semibold truncate px-2 py-1 rounded bg-black/20" style="color: rgba(220,220,240,0.9);">
                {{ order.customer_snapshot?.name || order.invoice_number }}
              </div>
              <div v-if="day.orders.length > 2" class="text-[10px] font-bold text-center mt-0.5" style="color: #a78bfa;">+{{ day.orders.length - 2 }} order</div>
            </div>
          </div>
          <div v-else class="text-[10px] font-medium" style="color: rgba(160,160,192,0.4);">
            Tidak ada
          </div>
        </div>
      </div>
    </div>

    <!-- Chart + Recent Orders -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Sales Chart -->
      <div class="lg:col-span-2 rounded-2xl p-6 transition-all duration-300"
           style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-bold" style="color: rgba(224,224,239,0.95);">Tren Penjualan</h3>
            <p class="text-sm mt-0.5" style="color: rgba(160,160,192,0.55);">Statistik omset dan profit bersih tahun ini</p>
          </div>
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full" style="background: #8b5cf6;"></span>
              <span style="color: rgba(160,160,192,0.6);">Omset</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full" style="background: #E07A5F;"></span>
              <span style="color: rgba(160,160,192,0.6);">Profit Bersih</span>
            </div>
          </div>
        </div>
        <div v-if="loading" class="h-[280px] rounded-xl animate-pulse"
             style="background: rgba(255,255,255,0.04);"></div>
        <div v-else class="h-[280px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="rounded-2xl p-6 transition-all duration-300"
           style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-base font-bold" style="color: rgba(224,224,239,0.95);">Order Terbaru</h3>
          <router-link to="/admin/orders"
                       class="text-xs font-semibold transition-colors flex items-center gap-1"
                       style="color: rgba(139,92,246,0.8);"
                       onmouseenter="this.style.color='rgba(167,139,250,1)'"
                       onmouseleave="this.style.color='rgba(139,92,246,0.8)'">
            Lihat Semua
            <ArrowRight :size="13" />
          </router-link>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="space-y-3">
          <div v-for="n in 5" :key="n" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl animate-pulse" style="background: rgba(255,255,255,0.06);"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 rounded animate-pulse" style="background: rgba(255,255,255,0.06); width: 70%;"></div>
              <div class="h-2.5 rounded animate-pulse" style="background: rgba(255,255,255,0.04); width: 50%;"></div>
            </div>
          </div>
        </div>

        <!-- Orders list -->
        <div v-else class="space-y-1">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group"
            style="border: 1px solid transparent;"
            @click="$router.push('/admin/orders')"
            onmouseenter="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.06)';"
            onmouseleave="this.style.background=''; this.style.borderColor='transparent';"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                 :style="orderAvatarStyle(order.status?.order)">
              {{ (order.customer_snapshot?.name || '?').charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate" style="color: rgba(224,224,239,0.9);">{{ order.customer_snapshot?.name }}</p>
              <p class="text-xs mt-0.5" style="color: rgba(160,160,192,0.5);">{{ order.invoice_number }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold" style="color: rgba(224,224,239,0.9);">{{ formatCurrency(order.finance?.total_amount || 0) }}</p>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    :style="paymentBadgeStyle(order.status?.payment)">
                {{ order.status?.payment }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Trend Chart -->
    <div class="rounded-2xl p-6 transition-all duration-300"
         style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-base font-bold" style="color: rgba(224,224,239,0.95);">Tren Penjualan Produk</h3>
          <p class="text-sm mt-0.5" style="color: rgba(160,160,192,0.55);">Distribusi produk terlaris setiap bulan</p>
        </div>
        <div class="p-2 rounded-xl" style="background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);">
          <BarChart3 :size="18" style="color: rgba(139,92,246,0.8);" />
        </div>
      </div>
      <div v-if="loading" class="h-[320px] rounded-xl animate-pulse"
           style="background: rgba(255,255,255,0.04);"></div>
      <div v-else class="h-[320px]">
        <Bar :data="productChartData" :options="productChartOptions" />
      </div>
    </div>

    <!-- Day Modal -->
    <BaseModal v-model="showDayModal" :title="`Order: ${selectedDay?.dayName}, ${selectedDay?.dateNum}`" size="lg">
      <div v-if="selectedDay?.orders.length === 0" class="text-center py-8 text-sm" style="color: rgba(160,160,192,0.6);">
        Tidak ada jadwal pengiriman di hari ini.
      </div>
      <div v-else class="space-y-2">
        <div v-for="order in selectedDay.orders" :key="order.id"
             @click="goToDetail(order.id)"
             class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group"
             style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);"
             onmouseenter="this.style.background='rgba(255,255,255,0.06)'; this.style.borderColor='rgba(139,92,246,0.3)';"
             onmouseleave="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.05)';">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
               :style="orderAvatarStyle(order.status?.order)">
            {{ (order.customer_snapshot?.name || '?').charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate" style="color: rgba(224,224,239,0.9);">{{ order.customer_snapshot?.name }}</p>
            <p class="text-xs mt-0.5" style="color: rgba(160,160,192,0.5);">{{ order.invoice_number }} • {{ order.delivery?.type || 'Delivery' }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold" style="color: rgba(224,224,239,0.9);">{{ formatCurrency(order.finance?.total_amount || 0) }}</p>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  :style="paymentBadgeStyle(order.status?.payment)">
              {{ order.status?.payment }}
            </span>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { dashboardApi, orderApi } from '../../api/apiService'
import BaseModal from '../../components/admin/BaseModal.vue'
import {
  ShoppingCart, Wallet, Users, Eye,
  TrendingUp, TrendingDown, CalendarDays, ArrowRight, BarChart3
} from '@lucide/vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const router = useRouter()
const loading = ref(true)
const recentOrders = ref([])

const getWeekDays = () => {
  const days = []
  const curr = new Date()
  const currentDay = curr.getDay()
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay
  
  curr.setDate(curr.getDate() + distanceToMonday)
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(curr)
    const dateStr = day.toLocaleDateString('en-CA') // YYYY-MM-DD
    days.push({
      dateObj: day,
      dateStr: dateStr,
      dayName: day.toLocaleDateString('id-ID', { weekday: 'short' }),
      dateNum: day.getDate(),
      orders: []
    })
    curr.setDate(curr.getDate() + 1)
  }
  return days
}

const todayStr = new Date().toLocaleDateString('en-CA')
const weekDays = ref(getWeekDays())
const showDayModal = ref(false)
const selectedDay = ref(null)

const openDayModal = (day) => {
  selectedDay.value = day
  showDayModal.value = true
}

const goToDetail = (id) => {
  showDayModal.value = false
  router.push({ name: 'AdminOrderDetail', params: { id } })
}

const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

const statCards = ref([
  {
    title: 'Total Order',
    value: '-',
    change: 0,
    icon: ShoppingCart,
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.12)',
    iconBorder: 'rgba(139,92,246,0.2)',
    glowColor: 'rgba(139,92,246,0.08)'
  },
  {
    title: 'Pendapatan Bersih',
    value: '-',
    change: 0,
    icon: Wallet,
    iconColor: '#E07A5F',
    iconBg: 'rgba(224,122,95,0.12)',
    iconBorder: 'rgba(224,122,95,0.2)',
    glowColor: 'rgba(224,122,95,0.08)'
  },
  {
    title: 'Total Pelanggan',
    value: '-',
    change: 0,
    icon: Users,
    iconColor: '#34d399',
    iconBg: 'rgba(52,211,153,0.12)',
    iconBorder: 'rgba(52,211,153,0.2)',
    glowColor: 'rgba(52,211,153,0.06)'
  },
  {
    title: 'Views Produk',
    value: '-',
    change: 0,
    icon: Eye,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.2)',
    glowColor: 'rgba(245,158,11,0.06)'
  }
])

// Dark chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a2e',
      titleColor: 'rgba(224,224,239,0.9)',
      bodyColor: 'rgba(160,160,192,0.8)',
      borderColor: 'rgba(139,92,246,0.3)',
      borderWidth: 1,
      titleFont: { family: 'Plus Jakarta Sans', weight: '600', size: 13 },
      bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
      padding: 14,
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
      ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: 'rgba(160,160,192,0.5)' }
    },
    y: {
      border: { display: false, dash: [4, 4] },
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        font: { family: 'Plus Jakarta Sans', size: 11 }, color: 'rgba(160,160,192,0.5)',
        callback: (v) => `${(v / 1_000_000).toFixed(0)}jt`
      }
    }
  }
}

const chartData = ref({ labels: [], datasets: [] })
const productChartData = ref({ labels: [], datasets: [] })

const productChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { family: 'Plus Jakarta Sans', size: 11 },
        color: 'rgba(160,160,192,0.6)'
      }
    },
    tooltip: {
      backgroundColor: '#1a1a2e',
      titleColor: 'rgba(224,224,239,0.9)',
      bodyColor: 'rgba(160,160,192,0.8)',
      borderColor: 'rgba(139,92,246,0.3)',
      borderWidth: 1,
      titleFont: { family: 'Plus Jakarta Sans', weight: '600', size: 13 },
      bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
      padding: 14,
      cornerRadius: 12,
      usePointStyle: true,
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw} porsi`
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      border: { display: false },
      ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: 'rgba(160,160,192,0.5)' }
    },
    y: {
      stacked: true,
      border: { display: false, dash: [4, 4] },
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: 'rgba(160,160,192,0.5)' },
      beginAtZero: true
    }
  }
}

const formatCurrency = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID')

const orderAvatarStyle = (s) => {
  const map = {
    completed: 'background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.2);',
    delivered: 'background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.2);',
    processing: 'background: rgba(96,165,250,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2);',
    pending: 'background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2);',
    cancelled: 'background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.2);'
  }
  return map[s] || 'background: rgba(160,160,192,0.1); color: rgba(160,160,192,0.7);'
}

const paymentBadgeStyle = (s) => {
  const map = {
    paid: 'background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2);',
    partial: 'background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2);',
    unpaid: 'background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2);',
    dp_received: 'background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2);'
  }
  return map[s] || 'background: rgba(160,160,192,0.1); color: rgba(160,160,192,0.6);'
}

onMounted(async () => {
  try {
    const res = await dashboardApi.getData()
    if (res.status === 'success') {
      const d = res.data
      const stats = d.stats

      statCards.value[0].value = Number(stats.total_orders.value || 0).toLocaleString('id-ID')
      statCards.value[0].change = stats.total_orders.trend

      statCards.value[1].value = formatCurrency(stats.net_revenue.value)
      statCards.value[1].change = stats.net_revenue.trend

      statCards.value[2].value = Number(stats.total_customers.value || 0).toLocaleString('id-ID')
      statCards.value[2].change = stats.total_customers.trend

      statCards.value[3].value = Number(stats.total_views.value || 0).toLocaleString('id-ID')
      
      // Kalkulasi presentase (trend) Views secara manual berdasarkan bulan ini & bulan sebelumnya jika datanya ada
      const views = stats.total_views
      const currentViews = Number(views.this_month || views.current_month || 0)
      const prevViews = Number(views.last_month || views.previous_month || 0)
      
      if (currentViews > 0 || prevViews > 0) {
        if (prevViews === 0) {
          statCards.value[3].change = currentViews > 0 ? 100 : 0
        } else {
          statCards.value[3].change = Math.round(((currentViews - prevViews) / prevViews) * 100)
        }
      } else {
        statCards.value[3].change = views.trend || 0
      }

      const months = d.chart.map(c => c.month)
      chartData.value = {
        labels: months,
        datasets: [
          {
            label: 'Omset',
            data: d.chart.map(c => c.omset),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.08)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#8b5cf6',
            pointHoverBorderColor: '#0f0f17',
            pointHoverBorderWidth: 3
          },
          {
            label: 'Profit Bersih',
            data: d.chart.map(c => c.profit),
            borderColor: '#E07A5F',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 5
          }
        ]
      }

      if (d.product_chart) {
        const productTotals = {}
        const productNames = {}
        d.product_chart.forEach(month => {
          month.products.forEach(p => {
            productTotals[p.product_id] = (productTotals[p.product_id] || 0) + p.total_sold
            productNames[p.product_id] = p.name
          })
        })
        const sortedIds = Object.keys(productTotals).sort((a, b) => productTotals[b] - productTotals[a])
        const top5Ids = sortedIds.slice(0, 5)
        const colors = ['#8b5cf6', '#E07A5F', '#34d399', '#f59e0b', '#60a5fa', '#9ca3af']

        const datasets = top5Ids.map((id, i) => ({
          label: productNames[id],
          data: d.product_chart.map(month => {
            const prod = month.products.find(p => p.product_id === id)
            return prod ? prod.total_sold : 0
          }),
          backgroundColor: colors[i] + 'cc',
          borderRadius: 6,
          barThickness: 28
        }))

        const othersData = d.product_chart.map(month =>
          month.products.filter(p => !top5Ids.includes(p.product_id))
            .reduce((sum, p) => sum + p.total_sold, 0)
        )
        if (othersData.some(v => v > 0)) {
          datasets.push({
            label: 'Lainnya',
            data: othersData,
            backgroundColor: colors[5] + 'cc',
            borderRadius: 6,
            barThickness: 28
          })
        }

        productChartData.value = {
          labels: d.product_chart.map(c => c.month),
          datasets
        }
      }

      recentOrders.value = d.recent_orders || []

      // Fetch upcoming orders for the calendar
      const orderRes = await orderApi.getAll(1, 100)
      if (orderRes.status === 'success') {
        const allOrders = orderRes.data
        weekDays.value.forEach(day => {
          day.orders = allOrders.filter(o => 
            o.delivery && 
            o.delivery.date && 
            o.delivery.date.startsWith(day.dateStr) &&
            (o.status?.order === 'pending' || o.status?.order === 'processing')
          )
        })
      }
    }
  } catch(e) {
    console.error('Dashboard error:', e)
  } finally {
    loading.value = false
  }
})
</script>
