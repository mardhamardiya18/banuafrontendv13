<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <!-- Toolbar: Search + Per Page -->
    <div v-if="searchable || $slots.header" class="px-6 py-4 border-b border-gray-100">
      <slot name="header" />
      <div v-if="searchable" class="flex flex-col sm:flex-row items-start sm:items-center gap-3" :class="{ 'mt-3': $slots.header }">
        <!-- Search Input -->
        <div class="relative flex-1 w-full sm:max-w-sm">
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
          <input
            :value="searchQuery"
            @input="onSearchInput"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-brand-maroon/40 focus:ring-2 focus:ring-brand-maroon/10 transition-all"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <i class="bx bx-x text-lg"></i>
          </button>
        </div>

        <!-- Per Page Selector -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-gray-400 font-medium">Tampilkan</span>
          <select
            :value="perPage"
            @change="onPerPageChange"
            class="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none bg-white focus:border-brand-maroon/40 cursor-pointer"
          >
            <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <span class="text-xs text-gray-400 font-medium">data</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="p-6">
      <div v-for="n in skeletonRows" :key="n" class="flex items-center gap-4 mb-4 last:mb-0">
        <div class="h-4 bg-gray-100 rounded-lg animate-pulse" :style="{ width: `${20 + Math.random() * 60}%` }"></div>
        <div class="h-4 bg-gray-100 rounded-lg animate-pulse flex-1"></div>
        <div class="h-4 bg-gray-100 rounded-lg animate-pulse w-20"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data.length" class="py-16 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i :class="searchQuery ? 'bx bx-search-alt' : 'bx bx-inbox'" class="text-3xl text-gray-300"></i>
      </div>
      <p class="text-gray-400 font-medium">{{ searchQuery ? 'Tidak ditemukan' : emptyText }}</p>
      <p class="text-sm text-gray-300 mt-1">{{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : emptySubText }}</p>
      <button v-if="searchQuery" @click="clearSearch" class="mt-4 text-sm font-semibold text-brand-maroon hover:text-brand-terracotta transition-colors">
        Hapus pencarian
      </button>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50/80">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              :class="col.class"
            >
              {{ col.label }}
            </th>
            <th v-if="$slots.actions" class="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="(row, idx) in data"
            :key="row.id || idx"
            class="hover:bg-gray-50/50 transition-colors group"
            :class="{ 'cursor-pointer': clickable }"
            @click="clickable && $emit('row-click', row)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 text-sm"
              :class="[col.tdClass, { 'max-w-[200px] truncate': col.truncate }]"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-6 py-4 text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="meta && meta.last_page > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
      <p class="text-sm text-gray-500">
        Menampilkan <span class="font-semibold text-gray-700">{{ (meta.current_page - 1) * meta.per_page + 1 }}</span>
        - <span class="font-semibold text-gray-700">{{ Math.min(meta.current_page * meta.per_page, meta.total) }}</span>
        dari <span class="font-semibold text-gray-700">{{ meta.total }}</span>
      </p>
      <div class="flex items-center gap-1">
        <button
          @click="$emit('page-change', meta.current_page - 1)"
          :disabled="meta.current_page <= 1"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bx bx-chevron-left text-xl"></i>
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="$emit('page-change', p)"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors"
          :class="p === meta.current_page
            ? 'bg-brand-maroon text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100'"
        >
          {{ p }}
        </button>
        <button
          @click="$emit('page-change', meta.current_page + 1)"
          :disabled="meta.current_page >= meta.last_page"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bx bx-chevron-right text-xl"></i>
        </button>
      </div>
    </div>
    <!-- Single page info (when pagination isn't shown but data exists) -->
    <div v-else-if="meta && data.length" class="px-6 py-3 border-t border-gray-100">
      <p class="text-sm text-gray-400">Total <span class="font-semibold text-gray-600">{{ meta.total }}</span> data</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  meta: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  searchable: { type: Boolean, default: true },
  searchQuery: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Cari data...' },
  perPage: { type: Number, default: 10 },
  perPageOptions: { type: Array, default: () => [5, 10, 25, 50] },
  emptyText: { type: String, default: 'Tidak ada data' },
  emptySubText: { type: String, default: 'Data akan muncul di sini setelah ditambahkan.' },
  skeletonRows: { type: Number, default: 5 }
})

const emit = defineEmits(['page-change', 'row-click', 'update:searchQuery', 'update:perPage', 'search'])

let searchTimer = null
const onSearchInput = (e) => {
  const val = e.target.value
  emit('update:searchQuery', val)
  // Debounce 350ms before emitting search event
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    emit('search', val)
  }, 350)
}

const clearSearch = () => {
  emit('update:searchQuery', '')
  emit('search', '')
}

const onPerPageChange = (e) => {
  emit('update:perPage', Number(e.target.value))
  emit('search', props.searchQuery) // Re-fetch with new perPage
}

const visiblePages = computed(() => {
  if (!props.meta) return []
  const { current_page, last_page } = props.meta
  const pages = []
  const start = Math.max(1, current_page - 2)
  const end = Math.min(last_page, current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>
