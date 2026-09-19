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

    <div class="dashboard-overview">
      <section class="metric-grid" aria-label="Statistik bisnis bulan ini">
        <article v-for="card in statCards" :key="card.title" class="metric-card" :style="{ '--metric-accent': card.iconColor, '--metric-tint': card.iconBg }" :aria-busy="loading">
          <div class="metric-top"><span class="metric-icon"><component :is="card.icon" :size="20" aria-hidden="true" /></span><span class="metric-period">Bulan ini</span></div>
          <h2 class="metric-label font-body">{{ card.title.replace(' (Bulan Ini)', '') }}</h2>
          <div v-if="loading" class="h-8 w-3/4 rounded-lg bg-white/5 animate-pulse my-2"></div>
          <p v-else class="metric-value">{{ card.value }}</p>
          <div v-if="!loading" class="metric-trend"><span :class="card.change >= 0 ? 'positive' : 'negative'"><component :is="card.change >= 0 ? TrendingUp : TrendingDown" :size="13" aria-hidden="true" />{{ card.change >= 0 ? '+' : '' }}{{ card.change }}%</span><span>dari bulan lalu</span></div>
          <div class="metric-total"><span>Total tahun ini</span><strong>{{ loading ? '?' : card.subtitleValue }}</strong></div>
        </article>
      </section>
      <OrderCalendar />
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

    <!-- Product Trend Chart & Top Viewed Products -->
    <div class="grid lg:grid-cols-3 gap-6">
      <ProductSalesChart
        class="lg:col-span-2"
        :months="productSalesMonths"
        :loading="loading"
        :error="productSalesError"
      />

      <!-- Top Viewed Products -->
      <div class="rounded-2xl p-6 transition-all duration-300"
           style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-base font-bold" style="color: rgba(224,224,239,0.95);">Top 5 Produk (Views)</h3>
          <router-link to="/admin/products"
                       class="text-xs font-semibold transition-colors flex items-center gap-1"
                       style="color: rgba(245,158,11,0.8);"
                       onmouseenter="this.style.color='rgba(251,191,36,1)'"
                       onmouseleave="this.style.color='rgba(245,158,11,0.8)'">
            Lihat Produk
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

        <!-- Top Products list -->
        <div v-else class="space-y-1">
          <div
            v-for="(product, index) in topViewedProducts"
            :key="product.id"
            class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group"
            style="border: 1px solid transparent;"
            @click="$router.push('/admin/products')"
            onmouseenter="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.06)';"
            onmouseleave="this.style.background=''; this.style.borderColor='transparent';"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                 style="background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2);">
              #{{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate" style="color: rgba(224,224,239,0.9);">{{ product.name }}</p>
            </div>
            <div class="text-right shrink-0 flex items-center gap-1.5">
              <Eye :size="14" style="color: rgba(160,160,192,0.6);" />
              <p class="text-sm font-bold" style="color: rgba(224,224,239,0.9);">{{ Number(product.views).toLocaleString('id-ID') }}</p>
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
import { dashboardApi } from '../../api/apiService'
import OrderCalendar from '../../components/admin/OrderCalendar.vue'
import ProductSalesChart from '../../components/admin/ProductSalesChart.vue'
import {
  ShoppingCart, Wallet, Users, Eye,
  TrendingUp, TrendingDown, CalendarDays, ArrowRight
} from '@lucide/vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const loading = ref(true)
const recentOrders = ref([])
const topViewedProducts = ref([])

const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

const statCards = ref([
  {
    title: 'Total Order (Bulan Ini)',
    value: '-',
    change: 0,
    subtitleLabel: 'Total Keseluruhan per Tahun',
    subtitleValue: '',
    icon: ShoppingCart,
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.12)',
    iconBorder: 'rgba(139,92,246,0.2)',
    glowColor: 'rgba(139,92,246,0.08)'
  },
  {
    title: 'Pendapatan Bersih (Bulan Ini)',
    value: '-',
    change: 0,
    subtitleLabel: 'Total Keseluruhan per Tahun',
    subtitleValue: '',
    icon: Wallet,
    iconColor: '#E07A5F',
    iconBg: 'rgba(224,122,95,0.12)',
    iconBorder: 'rgba(224,122,95,0.2)',
    glowColor: 'rgba(224,122,95,0.08)'
  },
  {
    title: 'Total Pelanggan (Bulan Ini)',
    value: '-',
    change: 0,
    subtitleLabel: 'Total Keseluruhan per Tahun',
    subtitleValue: '',
    icon: Users,
    iconColor: '#34d399',
    iconBg: 'rgba(52,211,153,0.12)',
    iconBorder: 'rgba(52,211,153,0.2)',
    glowColor: 'rgba(52,211,153,0.06)'
  },
  {
    title: 'Views Produk (Bulan Ini)',
    value: '-',
    change: 0,
    subtitleLabel: 'Total Keseluruhan per Tahun',
    subtitleValue: '',
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
      titleFont: { family: 'Poppins', weight: '600', size: 13 },
      bodyFont: { family: 'Poppins', size: 12 },
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
      ticks: { font: { family: 'Poppins', size: 11 }, color: 'rgba(160,160,192,0.5)' }
    },
    y: {
      border: { display: false, dash: [4, 4] },
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        font: { family: 'Poppins', size: 11 }, color: 'rgba(160,160,192,0.5)',
        callback: (v) => `${(v / 1_000_000).toFixed(0)}jt`
      }
    }
  }
}

const chartData = ref({ labels: [], datasets: [] })
const productSalesMonths = ref([])
const productSalesError = ref(false)

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
    if (res.status !== 'success') throw new Error('Dashboard request failed')
    if (res.status === 'success') {
      const d = res.data
      const stats = d.stats

      statCards.value[0].value = Number(stats.total_orders.value || 0).toLocaleString('id-ID')
      statCards.value[0].change = stats.total_orders.trend
      const totalOrdersYear = stats.total_orders.total_year ?? stats.total_orders.total_all_time ?? 0
      statCards.value[0].subtitleValue = `${Number(totalOrdersYear).toLocaleString('id-ID')} order`

      statCards.value[1].value = formatCurrency(stats.net_revenue.value)
      statCards.value[1].change = stats.net_revenue.trend
      const totalRevenueYear = stats.net_revenue.total_year ?? stats.net_revenue.total_all_time ?? 0
      statCards.value[1].subtitleValue = formatCurrency(totalRevenueYear)

      statCards.value[2].value = Number(stats.total_customers.value || 0).toLocaleString('id-ID')
      statCards.value[2].change = stats.total_customers.trend
      const totalCustomersYear = stats.total_customers.total_year ?? stats.total_customers.total_all_time ?? 0
      statCards.value[2].subtitleValue = `${Number(totalCustomersYear).toLocaleString('id-ID')} pelanggan`

      statCards.value[3].value = Number(stats.total_views.value || 0).toLocaleString('id-ID')
      const totalViewsYear = stats.total_views.total_year ?? stats.total_views.total_all_time ?? 0
      statCards.value[3].subtitleValue = `${Number(totalViewsYear).toLocaleString('id-ID')} views`
      
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

      productSalesMonths.value = d.product_chart || []
      productSalesError.value = !Array.isArray(d.product_chart)

      recentOrders.value = d.recent_orders || []
      topViewedProducts.value = d.top_viewed_products || []


    }
  } catch(e) {
    if (!productSalesMonths.value.length) productSalesError.value = true
    console.error('Dashboard error:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard-overview { display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; }
.metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.metric-card { min-width: 0; display: flex; flex-direction: column; padding: 23px; background: radial-gradient(ellipse at top right, var(--metric-tint), transparent 65%), #141420; border: 1px solid #ffffff0d; border-radius: 22px; }
.metric-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.metric-icon { color: var(--metric-accent); background: var(--metric-tint); border-radius: 13px; width: 42px; height: 42px; display: grid; place-items: center; }
.metric-period { font-size: 10px; color: #9898b2; padding: 5px 9px; border-radius: 20px; border: 1px solid #ffffff0d; }
.metric-label { font-size: 12px; font-weight: 500; color: #aaaac1; }
.metric-value { color: #f1f1fa; font-size: clamp(21px, 2vw, 30px); font-weight: 750; letter-spacing: -.055em; margin-top: 6px; overflow-wrap: anywhere; }
.metric-trend { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; font-size: 10px; color: #9797b0; margin: 12px 0 20px; }
.metric-trend > span:first-child { display: inline-flex; align-items: center; gap: 4px; border-radius: 6px; padding: 3px 6px; }
.positive { color: #6ee7b7; background: #34d39912; }.negative { color: #fca5a5; background: #f8717112; }
.metric-total { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 13px; border-top: 1px solid #ffffff0d; font-size: 10px; color: #9797b0; }
.metric-total strong { color: var(--metric-accent); font-weight: 650; }
@media(min-width: 1280px) { .dashboard-overview { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
@media(max-width: 479px) { .metric-card { padding: 15px; border-radius: 17px; }.metric-grid { gap: 10px; }.metric-period { font-size: 9px; padding: 4px 6px; }.metric-value { font-size: 21px; }.metric-icon { width: 32px; height: 32px; } }
</style>
