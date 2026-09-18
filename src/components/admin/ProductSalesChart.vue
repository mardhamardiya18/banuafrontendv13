<template>
  <section class="min-w-0 rounded-2xl p-6" style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);" aria-labelledby="product-sales-title">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-5">
      <div>
        <h3 id="product-sales-title" class="text-base font-bold text-slate-100">Penjualan per Produk</h3>
        <p class="text-sm mt-1 text-slate-400">Jumlah porsi setiap produk · Tahun {{ year }}</p>
      </div>
      <label class="flex flex-col gap-1 text-xs text-slate-400">
        Periode penjualan
        <select v-model="period" :disabled="loading" class="rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option value="year">Total tahun {{ year }}</option>
          <option v-for="(month, index) in months" :key="month.month" :value="month.month">{{ monthNames[index] || month.month }} {{ year }}</option>
        </select>
      </label>
    </div>
    <div v-if="loading" class="h-[320px] rounded-xl animate-pulse bg-white/5" aria-label="Memuat penjualan produk"></div>
    <p v-else-if="error" role="alert" class="py-12 text-center text-sm text-rose-300">Data penjualan produk gagal dimuat. Muat ulang halaman untuk mencoba kembali.</p>
    <template v-else>
      <div class="flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-violet-500/10 px-4 py-3 mb-4 text-sm" aria-live="polite">
        <span class="text-slate-300">Total <strong class="text-violet-300 tabular-nums">{{ formatNumber(sales.total) }} porsi</strong></span>
        <span class="text-slate-300"><strong class="text-slate-100">{{ formatNumber(sales.products.length) }}</strong> produk terjual</span>
      </div>
      <p v-if="!sales.products.length" class="py-12 text-center text-sm text-slate-400">Belum ada penjualan produk pada periode ini.</p>
      <template v-else>
        <p class="text-xs text-slate-400 mb-4">Urutan penjualan terbanyak. Persentase dihitung dari total porsi periode ini.</p>
        <div class="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 focus:outline-none focus:ring-2 focus:ring-violet-400 rounded" tabindex="0" role="region" aria-label="Penjualan semua produk, gulir untuk melihat seluruh daftar">
          <ol class="space-y-5">
            <li v-for="product in sales.products" :key="product.id">
              <div class="flex flex-wrap justify-between gap-x-4 gap-y-1 mb-2 text-sm">
                <span class="min-w-0 flex-1 break-words text-slate-200">{{ product.name }}</span>
                <span class="shrink-0 tabular-nums text-right">
                  <strong class="text-slate-100">{{ formatNumber(product.total) }} porsi</strong>
                  <span class="text-xs text-slate-400 ml-2">{{ formatPercent(product.total / sales.total) }}</span>
                </span>
              </div>
              <div class="h-3 rounded-full bg-white/5 overflow-hidden" aria-hidden="true">
                <div class="h-full rounded-full bg-violet-400" :style="{ width: `${product.total / sales.maximum * 100}%` }"></div>
              </div>
            </li>
          </ol>
        </div>
        <div class="flex justify-between text-xs text-slate-400 mt-4 tabular-nums" aria-hidden="true">
          <span>0</span><span>Skala batang: {{ formatNumber(sales.maximum) }} porsi</span>
        </div>
      </template>
      <p class="text-xs text-slate-500 mt-4">Berdasarkan tanggal order yang sudah dibayar atau selesai, tidak termasuk order dibatalkan.</p>
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { summarizeProductSales } from '../../utils/productSales.js'

const props = defineProps({
  months: { type: Array, default: () => [] },
  loading: Boolean,
  error: Boolean,
})
const now = new Date()
const year = now.getFullYear()
const period = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()])
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const sales = computed(() => summarizeProductSales(props.months, period.value))
const formatNumber = value => value.toLocaleString('id-ID')
const formatPercent = value => value.toLocaleString('id-ID', { style: 'percent', maximumFractionDigits: 1 })
</script>
