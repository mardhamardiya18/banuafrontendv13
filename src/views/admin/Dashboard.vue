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
            <p class="text-sm text-gray-400">Statistik omset dan profit bersih tahun ini</p>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-brand-maroon"></span>
              <span class="text-gray-500">Omset</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-brand-terracotta/40"></span>
              <span class="text-gray-500">Profit Bersih</span>
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
                 :class="statusColor(order.status?.order)">
              {{ (order.customer_snapshot?.name || '?').charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ order.customer_snapshot?.name }}</p>
              <p class="text-xs text-gray-400">{{ order.invoice_number }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-gray-800">{{ formatCurrency(order.finance?.total_amount || 0) }}</p>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    :class="paymentBadge(order.status?.payment)">
                {{ order.status?.payment }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Trend Chart -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Tren Penjualan Produk</h3>
          <p class="text-sm text-gray-400">Distribusi produk terlaris setiap bulan</p>
        </div>
      </div>
      <div v-if="loading" class="h-[350px] bg-gray-50 rounded-xl animate-pulse"></div>
      <div v-else class="h-[350px]">
        <Bar :data="productChartData" :options="productChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { dashboardApi, orderApi } from '../../api/apiService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const loading = ref(true)
const recentOrders = ref([])

const statCards = ref([
  { title: 'Total Order', value: '-', change: 0, icon: 'bx bxs-cart-alt', color: '#690B22', bg: 'bg-brand-maroon/5' },
  { title: 'Pendapatan Bersih', value: '-', change: 0, icon: 'bx bxs-wallet', color: '#E07A5F', bg: 'bg-brand-terracotta/10' },
  { title: 'Total Pelanggan', value: '-', change: 0, icon: 'bx bxs-group', color: '#1B4D3E', bg: 'bg-emerald-50' },
  { title: 'Views Produk', value: '-', change: 0, icon: 'bx bxs-show', color: '#f59e0b', bg: 'bg-amber-50' }
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
        font: { family: 'Poppins', size: 12 },
        color: '#4b5563'
      }
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleFont: { family: 'Poppins', weight: '600' },
      bodyFont: { family: 'Poppins' },
      padding: 12,
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
      ticks: { font: { family: 'Poppins', size: 12 }, color: '#9ca3af' }
    },
    y: {
      stacked: true,
      border: { dash: [5, 5] },
      grid: { color: '#f3f4f6' },
      ticks: { font: { family: 'Poppins', size: 12 }, color: '#9ca3af' },
      beginAtZero: true
    }
  }
}

const formatCurrency = (val) => {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

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
      statCards.value[3].change = stats.total_views.trend

      const months = d.chart.map(c => c.month)
      const omset = d.chart.map(c => c.omset)
      const profit = d.chart.map(c => c.profit)
      
      chartData.value = {
        labels: months,
        datasets: [
          {
            label: 'Omset',
            data: omset,
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
            label: 'Profit Bersih',
            data: profit,
            borderColor: 'rgba(224, 122, 95, 0.8)',
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
      
      // Product Chart
      if (d.product_chart) {
        const productTotals = {}
        const productNames = {}
        
        d.product_chart.forEach(month => {
          month.products.forEach(p => {
            productTotals[p.product_id] = (productTotals[p.product_id] || 0) + p.total_sold
            productNames[p.product_id] = p.name
          })
        })
        
        const sortedProductIds = Object.keys(productTotals).sort((a, b) => productTotals[b] - productTotals[a])
        const top5Ids = sortedProductIds.slice(0, 5)
        
        const colors = ['#690B22', '#E07A5F', '#1B4D3E', '#F59E0B', '#3B82F6', '#9CA3AF']
        
        const datasets = top5Ids.map((id, index) => {
          return {
            label: productNames[id],
            data: d.product_chart.map(month => {
              const prod = month.products.find(p => p.product_id === id)
              return prod ? prod.total_sold : 0
            }),
            backgroundColor: colors[index],
            barThickness: 32
          }
        })
        
        const othersData = d.product_chart.map(month => {
          return month.products
            .filter(p => !top5Ids.includes(p.product_id))
            .reduce((sum, p) => sum + p.total_sold, 0)
        })
        
        if (othersData.some(val => val > 0)) {
          datasets.push({
            label: 'Lainnya',
            data: othersData,
            backgroundColor: colors[5],
            barThickness: 32
          })
        }
        
        productChartData.value = {
          labels: d.product_chart.map(c => c.month),
          datasets: datasets
        }
      }

      recentOrders.value = d.recent_orders || []
    }
  } catch(e) {
    console.error('Error fetching dashboard:', e)
  } finally {
    loading.value = false
  }
})
</script>
