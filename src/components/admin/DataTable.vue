<template>
  <div class="rounded-2xl overflow-hidden transition-all duration-300"
       style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
    <!-- Toolbar -->
    <div v-if="searchable || $slots.header" class="px-6 py-4 flex flex-col xl:flex-row xl:items-center gap-4"
         style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      
      <div v-if="searchable" class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
        <!-- Search Input -->
        <div class="relative flex-1 w-full sm:max-w-sm">
          <Search :size="15"
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style="color: rgba(160,160,192,0.4);" />
          <input
            :value="searchQuery"
            @input="onSearchInput"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style="
              background: rgba(255,255,255,0.04);
              border: 1px solid rgba(255,255,255,0.07);
              color: rgba(224,224,239,0.9);
            "
            @focus="e => { e.target.style.borderColor='rgba(139,92,246,0.4)'; e.target.style.background='rgba(139,92,246,0.04)'; }"
            @blur="e => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.background='rgba(255,255,255,0.04)'; }"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style="color: rgba(160,160,192,0.4);"
            onmouseenter="this.style.color='rgba(224,224,239,0.8)'"
            onmouseleave="this.style.color='rgba(160,160,192,0.4)'"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Per Page Selector -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-medium" style="color: rgba(180,180,210,0.7);">Tampilkan</span>
          <select
            :value="perPage"
            @change="onPerPageChange"
            class="px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer transition-all duration-200"
            style="
              background: rgba(255,255,255,0.06);
              border: 1px solid rgba(255,255,255,0.1);
              color: rgba(224,224,239,0.95);
            "
          >
            <option v-for="opt in perPageOptions" :key="opt" :value="opt"
                    style="background: #141420; color: #e0e0ef;">{{ opt }}</option>
          </select>
          <span class="text-xs font-medium" style="color: rgba(160,160,192,0.5);">data</span>
        </div>
      </div>

      <div v-if="$slots.header" class="w-full xl:w-auto flex flex-1 justify-start xl:justify-end">
        <slot name="header" />
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="p-6 space-y-3">
      <div v-for="n in skeletonRows" :key="n" class="flex items-center gap-4">
        <div class="h-4 rounded-lg animate-pulse" :style="{ width: `${25 + (n * 13) % 45}%`, background: 'rgba(255,255,255,0.08)' }"></div>
        <div class="h-4 rounded-lg animate-pulse flex-1" style="background: rgba(255,255,255,0.06);"></div>
        <div class="h-4 rounded-lg animate-pulse w-20" style="background: rgba(255,255,255,0.08);"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data.length" class="py-16 text-center">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
           style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);">
        <component :is="searchQuery ? SearchX : Inbox" :size="28" style="color: rgba(180,180,210,0.5);" />
      </div>
      <p class="font-medium" style="color: rgba(210,210,235,0.8);">{{ searchQuery ? 'Tidak ditemukan' : emptyText }}</p>
      <p class="text-sm mt-1" style="color: rgba(160,160,192,0.55);">
        {{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : emptySubText }}
      </p>
      <button v-if="searchQuery" @click="clearSearch"
              class="mt-4 text-sm font-semibold transition-colors"
              style="color: rgba(139,92,246,0.8);"
              onmouseenter="this.style.color='rgba(167,139,250,1)'"
              onmouseleave="this.style.color='rgba(139,92,246,0.8)'">
        Hapus pencarian
      </button>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr style="background: rgba(255,255,255,0.04);">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
              :class="col.class"
              style="color: rgba(190,190,220,0.8); letter-spacing: 0.07em;"
            >
              {{ col.label }}
            </th>
            <th v-if="$slots.actions"
                class="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider"
                style="color: rgba(190,190,220,0.8); letter-spacing: 0.07em;">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in data"
            :key="row.id || idx"
            class="transition-colors duration-150 group"
            :class="{ 'cursor-pointer': clickable }"
            style="border-top: 1px solid rgba(255,255,255,0.04);"
            @click="clickable && $emit('row-click', row)"
            @mouseenter="e => e.currentTarget.style.background='rgba(139,92,246,0.05)'"
            @mouseleave="e => e.currentTarget.style.background=''"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 text-sm"
              :class="[col.tdClass, { 'max-w-[200px] truncate': col.truncate }]"
              style="color: rgba(225,225,245,0.92);"
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
    <div v-if="meta && meta.last_page > 1" class="px-6 py-4 flex items-center justify-between"
         style="border-top: 1px solid rgba(255,255,255,0.06);">
      <p class="text-sm" style="color: rgba(180,180,210,0.7);">
        Menampilkan
        <span class="font-semibold" style="color: rgba(230,230,250,0.95);">{{ (meta.current_page - 1) * meta.per_page + 1 }}</span>
        -
        <span class="font-semibold" style="color: rgba(230,230,250,0.95);">{{ Math.min(meta.current_page * meta.per_page, meta.total) }}</span>
        dari
        <span class="font-semibold" style="color: rgba(230,230,250,0.95);">{{ meta.total }}</span>
      </p>
      <div class="flex items-center gap-1">
        <button
          @click="$emit('page-change', meta.current_page - 1)"
          :disabled="meta.current_page <= 1"
          class="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style="color: rgba(160,160,192,0.6);"
          onmouseenter="if (!this.disabled) { this.style.background='rgba(255,255,255,0.06)'; this.style.color='rgba(224,224,239,0.9)'; }"
          onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.6)';"
        >
          <ChevronLeft :size="18" />
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="$emit('page-change', p)"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200"
          :style="p === meta.current_page
            ? 'background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3);'
            : 'color: rgba(160,160,192,0.6);'"
          @mouseenter="e => { if (p !== meta.current_page) e.target.style.background='rgba(255,255,255,0.05)'; }"
          @mouseleave="e => { if (p !== meta.current_page) e.target.style.background=''; }"
        >
          {{ p }}
        </button>
        <button
          @click="$emit('page-change', meta.current_page + 1)"
          :disabled="meta.current_page >= meta.last_page"
          class="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style="color: rgba(160,160,192,0.6);"
          onmouseenter="if (!this.disabled) { this.style.background='rgba(255,255,255,0.06)'; this.style.color='rgba(224,224,239,0.9)'; }"
          onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.6)';"
        >
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>

    <!-- Single page info -->
    <div v-else-if="meta && data.length" class="px-6 py-3"
         style="border-top: 1px solid rgba(255,255,255,0.06);">
      <p class="text-sm" style="color: rgba(180,180,210,0.7);">
        Total <span class="font-semibold" style="color: rgba(225,225,245,0.9);">{{ meta.total }}</span> data
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Search, X, SearchX, Inbox, ChevronLeft, ChevronRight } from '@lucide/vue'

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
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => emit('search', val), 350)
}

const clearSearch = () => {
  emit('update:searchQuery', '')
  emit('search', '')
}

const onPerPageChange = (e) => {
  emit('update:perPage', Number(e.target.value))
  emit('search', props.searchQuery)
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
