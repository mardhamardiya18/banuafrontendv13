<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Selamat datang kembali! Berikut ringkasan bisnis Anda.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="card in statCards" :key="card.title"
           class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
               :class="card.bg">
            <i :class="[card.icon, 'text-xl']" :style="{ color: card.color }"></i>
          </div>
          <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                :class="card.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'">
            <i :class="card.change >= 0 ? 'bx bx-trending-up' : 'bx bx-trending-down'" class="text-sm"></i>
            {{ card.change >= 0 ? '+' : '' }}{{ card.change }}%
          </span>
        </div>
        <div>
          <!-- Skeleton while loading -->
          <div v-if="loading" class="h-7 bg-gray-100 rounded-lg animate-pulse w-2/3 mb-1.5"></div>
          <p v-else class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
          <p class="text-sm text-gray-400 font-medium mt-0.5">{{ card.title }}</p>
        </div>
      </div>
    </div>

    <!-- Chart + Recent Orders -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Sales Chart -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Tren Penjualan</h3>
            <p class="text-sm text-gray-400">Perbandingan tahun ini vs tahun lalu</p>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-brand-maroon"></span>
              <span class="text-gray-500">2026</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-brand-terracotta/40"></span>
              <span class="text-gray-500">2025</span>
            </div>
          </div>
        </div>
        <div v-if="loading" class="h-[300px] bg-gray-50 rounded-xl animate-pulse"></div>
        <div v-else class="h-[300px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-gray-900">Order Terbaru</h3>
          <router-link to="/admin/orders" class="text-xs font-semibold text-brand-maroon hover:text-brand-terracotta transition-colors">
            Lihat Semua →
          </router-link>
        </div>
        <div v-if="loading" class="space-y-4">
          <div v-for="n in 4" :key="n" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
        <div v-else class="space-y-4">
          <div v-for="order in recentOrders" :key="order.id"
               class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
               @click="$router.push('/admin/orders')">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                 :class="statusColor(order.order_status)">
              {{ order.customer_name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ order.customer_name }}</p>
              <p class="text-xs text-gray-400">{{ order.invoice_number }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-gray-800">{{ formatCurrency(order.total_amount) }}</p>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    :class="paymentBadge(order.payment_status)">
                {{ order.payment_status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { dashboardApi, orderApi } from '../../api/mockService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const loading = ref(true)
const recentOrders = ref([])

const statCards = ref([
  { title: 'Total Order', value: '-', change: 12, icon: 'bx bxs-cart-alt', color: '#690B22', bg: 'bg-brand-maroon/5' },
  { title: 'Total Pendapatan', value: '-', change: 8.5, icon: 'bx bxs-wallet', color: '#E07A5F', bg: 'bg-brand-terracotta/10' },
  { title: 'Total Pelanggan', value: '-', change: 15, icon: 'bx bxs-group', color: '#1B4D3E', bg: 'bg-emerald-50' },
  { title: 'Rating', value: '-', change: 0.2, icon: 'bx bxs-star', color: '#f59e0b', bg: 'bg-amber-50' }
])

const chartData = ref({ labels: [], datasets: [] })
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      titleFont: { family: 'Poppins', weight: '600' },
      bodyFont: { family: 'Poppins' },
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Poppins', size: 12 }, color: '#9ca3af' }
    },
    y: {
      border: { dash: [5, 5] },
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { family: 'Poppins', size: 12 }, color: '#9ca3af',
        callback: (v) => `${(v / 1_000_000).toFixed(0)}jt`
      }
    }
  }
}

const formatCurrency = (val) => `Rp ${val.toLocaleString('id-ID')}`

const statusColor = (s) => ({
  'bg-emerald-50 text-emerald-600': s === 'completed' || s === 'delivered',
  'bg-blue-50 text-blue-600': s === 'processing',
  'bg-amber-50 text-amber-600': s === 'pending',
  'bg-red-50 text-red-600': s === 'cancelled'
})

const paymentBadge = (s) => ({
  'bg-emerald-50 text-emerald-600': s === 'paid',
  'bg-amber-50 text-amber-600': s === 'partial',
  'bg-red-50 text-red-600': s === 'unpaid'
})

onMounted(async () => {
  try {
    const [statsRes, chartRes, ordersRes] = await Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getSalesChart(),
      orderApi.getAll(1, 5)
    ])

    if (statsRes.status === 'success') {
      const d = statsRes.data
      statCards.value[0].value = d.totalOrders.toLocaleString('id-ID')
      statCards.value[1].value = formatCurrency(d.totalRevenue)
      statCards.value[2].value = d.totalCustomers.toString()
      statCards.value[3].value = d.averageRating.toString()
    }

    if (chartRes.status === 'success') {
      chartData.value = {
        labels: chartRes.data.labels,
        datasets: [
          {
            label: chartRes.data.datasets[0].label,
            data: chartRes.data.datasets[0].data,
            borderColor: '#690B22',
            backgroundColor: 'rgba(105, 11, 34, 0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#690B22',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3
          },
          {
            label: chartRes.data.datasets[1].label,
            data: chartRes.data.datasets[1].data,
            borderColor: 'rgba(224, 122, 95, 0.4)',
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
    }

    if (ordersRes.status === 'success') {
      recentOrders.value = ordersRes.data.slice(0, 5)
    }
  } finally {
    loading.value = false
  }
})
</script>
