<template>
  <div class="space-y-8 text-[#e0e0ef]">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Buku Kas (Arus Kas)</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">
          Catat dan pantau seluruh transaksi keuangan masuk dan keluar secara terstruktur.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-600/10"
        >
          <Plus :size="16" />
          Catat Transaksi Manual
        </button>
      </div>
    </div>

    <!-- Summary Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Card: Kas Masuk -->
      <div class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
           style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
           @mouseenter="e => e.currentTarget.style.borderColor='rgba(52,211,153,0.2)'"
           @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'">
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(52,211,153,0.06)"></div>
        <div class="flex items-start justify-between mb-4 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 shrink-0"
               style="background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.2)">
            <ArrowDownToLine :size="22" style="color: #34d399;" />
          </div>
        </div>
        <div class="relative z-10 flex-1 flex flex-col justify-end">
          <p class="text-2xl font-bold tracking-tight text-emerald-400">{{ formatCurrency(summary.total_in) }}</p>
          <p class="text-sm font-medium mt-0.5 leading-snug" style="color: rgba(160,160,192,0.65);">Total Kas Masuk (Keseluruhan)</p>
          <div class="mt-4 pt-3 border-t space-y-2 text-xs" style="border-color: rgba(255,255,255,0.07);">
            <div class="flex justify-between items-center">
              <span class="font-medium flex items-center gap-1.5" style="color: rgba(160,160,192,0.65);">
                <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400"></span> Akumulasi Bulan Ini
              </span>
              <span class="font-bold text-emerald-400 tracking-wide">{{ formatCurrency(summary.total_in_month || 0) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-medium flex items-center gap-1.5" style="color: rgba(160,160,192,0.65);">
                <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400"></span> Akumulasi Tahun Ini
              </span>
              <span class="font-bold text-emerald-400 tracking-wide">{{ formatCurrency(summary.total_in_year || 0) }}</span>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style="background: linear-gradient(90deg, transparent, #34d399, transparent)"></div>
      </div>

      <!-- Card: Kas Keluar -->
      <div class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
           style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
           @mouseenter="e => e.currentTarget.style.borderColor='rgba(244,63,94,0.2)'"
           @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'">
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(244,63,94,0.06)"></div>
        <div class="flex items-start justify-between mb-4 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 shrink-0"
               style="background: rgba(244,63,94,0.12); border: 1px solid rgba(244,63,94,0.2)">
            <ArrowUpFromLine :size="22" style="color: #f43f5e;" />
          </div>
        </div>
        <div class="relative z-10 flex-1 flex flex-col justify-end">
          <p class="text-2xl font-bold tracking-tight text-rose-400">{{ formatCurrency(summary.total_out) }}</p>
          <p class="text-sm font-medium mt-0.5 leading-snug" style="color: rgba(160,160,192,0.65);">Total Kas Keluar (Keseluruhan)</p>
          <div class="mt-4 pt-3 border-t space-y-2 text-xs" style="border-color: rgba(255,255,255,0.07);">
            <div class="flex justify-between items-center">
              <span class="font-medium flex items-center gap-1.5" style="color: rgba(160,160,192,0.65);">
                <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-rose-400"></span> Akumulasi Bulan Ini
              </span>
              <span class="font-bold text-rose-400 tracking-wide">{{ formatCurrency(summary.total_out_month || 0) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-medium flex items-center gap-1.5" style="color: rgba(160,160,192,0.65);">
                <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-rose-400"></span> Akumulasi Tahun Ini
              </span>
              <span class="font-bold text-rose-400 tracking-wide">{{ formatCurrency(summary.total_out_year || 0) }}</span>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style="background: linear-gradient(90deg, transparent, #f43f5e, transparent)"></div>
      </div>

      <!-- Card: Saldo Bersih -->
      <div class="relative rounded-2xl p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
           style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);"
           @mouseenter="e => e.currentTarget.style.borderColor='rgba(139,92,246,0.2)'"
           @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'">
        <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style="background: rgba(139,92,246,0.06)"></div>
        <div class="flex items-start justify-between mb-4 relative z-10">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 shrink-0"
               style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.2)">
            <Wallet :size="22" style="color: #a78bfa;" />
          </div>
        </div>
        <div class="relative z-10 flex-1 flex flex-col justify-end">
          <p class="text-2xl font-bold tracking-tight text-white" :class="summary.net_saldo >= 0 ? 'text-emerald-400' : 'text-rose-400'">{{ formatCurrency(summary.net_saldo) }}</p>
          <p class="text-sm font-medium mt-0.5 leading-snug" style="color: rgba(160,160,192,0.65);">Saldo Bersih (Keseluruhan)</p>
          <div class="mt-4 pt-3 border-t space-y-2 text-xs" style="border-color: rgba(255,255,255,0.07);">
            <div class="flex justify-between items-center">
              <span class="font-medium flex items-center gap-1.5" style="color: rgba(160,160,192,0.65);">
                <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-purple-400"></span> Saldo Bulan Ini
              </span>
              <span class="font-bold tracking-wide" :class="(summary.net_saldo_month || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'">{{ formatCurrency(summary.net_saldo_month || 0) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-medium flex items-center gap-1.5" style="color: rgba(160,160,192,0.65);">
                <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-purple-400"></span> Saldo Tahun Ini
              </span>
              <span class="font-bold tracking-wide" :class="(summary.net_saldo_year || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'">{{ formatCurrency(summary.net_saldo_year || 0) }}</span>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style="background: linear-gradient(90deg, transparent, #a78bfa, transparent)"></div>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="rounded-2xl p-6 space-y-4" style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
      <div class="flex items-center gap-2 pb-3 border-b border-white/5">
        <ArrowLeftRight :size="16" class="text-purple-400" />
        <h3 class="text-sm font-bold text-white">Filter Data Buku Kas</h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Notes -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Pencarian Catatan</label>
          <div class="relative">
            <input
              type="text"
              v-model="filters.search"
              placeholder="Cari catatan..."
              class="w-full bg-[#141420] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
              @input="handleFilterChange"
            />
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <!-- Filter Type -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Jenis Transaksi</label>
          <select
            v-model="filters.type"
            @change="handleFilterChange"
            class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Semua Jenis</option>
            <option value="IN">Kas Masuk (IN)</option>
            <option value="OUT">Kas Keluar (OUT)</option>
          </select>
        </div>

        <!-- Filter Category -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Kategori</label>
          <select
            v-model="filters.category"
            @change="handleFilterChange"
            class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in presetCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Date Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Rentang Tanggal</label>
          <div class="flex items-center gap-2">
            <input
              type="date"
              v-model="filters.start_date"
              @change="handleFilterChange"
              class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <span class="text-xs text-gray-500">s/d</span>
            <input
              type="date"
              v-model="filters.end_date"
              @change="handleFilterChange"
              class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- Clear Filter Button -->
      <div v-if="hasActiveFilters" class="flex justify-end pt-2">
        <button
          @click="clearFilters"
          class="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <X :size="12" />
          Bersihkan Filter
        </button>
      </div>
    </div>

    <!-- Data Table Card -->
    <div class="rounded-2xl overflow-hidden" style="background: rgba(20,20,32,0.8); border: 1px solid rgba(255,255,255,0.06);">
      <div class="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-base font-bold text-white">Daftar Transaksi Kas</h3>
        <button
          @click="fetchData"
          class="p-2 bg-[#141420] border border-white/5 hover:bg-white/5 rounded-xl transition-all duration-150"
          title="Refresh Data"
        >
          <RefreshCw :size="14" class="text-gray-400" />
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/5 bg-black/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th class="py-4 px-6">Tanggal</th>
              <th class="py-4 px-6">Jenis</th>
              <th class="py-4 px-6">Kategori</th>
              <th class="py-4 px-6">Jumlah</th>
              <th class="py-4 px-6">Keterangan</th>
              <th class="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-sm">
            <tr v-if="loading" v-for="n in 5" :key="'skeleton-' + n" class="animate-pulse">
              <td class="py-4 px-6"><div class="h-4 bg-white/5 rounded w-24"></div></td>
              <td class="py-4 px-6"><div class="h-5 bg-white/5 rounded-full w-12"></div></td>
              <td class="py-4 px-6"><div class="h-4 bg-white/5 rounded w-20"></div></td>
              <td class="py-4 px-6"><div class="h-4 bg-white/5 rounded w-28"></div></td>
              <td class="py-4 px-6"><div class="h-4 bg-white/5 rounded w-48"></div></td>
              <td class="py-4 px-6"><div class="h-8 bg-white/5 rounded-lg w-16 mx-auto"></div></td>
            </tr>
            <tr v-else-if="cashflows.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-500 font-medium">
                Tidak ada data transaksi yang ditemukan.
              </td>
            </tr>
            <tr v-else v-for="item in cashflows" :key="item.id" class="hover:bg-white/[0.01] transition-colors">
              <td class="py-4 px-6 whitespace-nowrap text-gray-400">
                {{ formatDate(item.transaction_date) }}
              </td>
              <td class="py-4 px-6">
                <span
                  class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
                  :style="item.type === 'IN'
                    ? 'background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2);'
                    : 'background: rgba(244,63,94,0.1); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2);'"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="py-4 px-6 font-semibold whitespace-nowrap">
                <span class="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300 text-xs">
                  {{ item.category }}
                </span>
              </td>
              <td class="py-4 px-6 font-bold whitespace-nowrap" :class="item.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'">
                {{ item.type === 'IN' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
              </td>
              <td class="py-4 px-6 text-gray-300 max-w-xs truncate">
                <div v-if="item.order_id">
                  <router-link
                    :to="'/admin/orders/' + item.order_id"
                    class="text-purple-400 hover:text-purple-300 font-semibold underline flex items-center gap-1 text-xs"
                  >
                    <span>Otomatis (Order: {{ item.order?.invoice_number || 'Detail' }})</span>
                  </router-link>
                  <p class="text-xs text-gray-500 mt-0.5 truncate">{{ item.notes }}</p>
                </div>
                <span v-else>{{ item.notes || '-' }}</span>
              </td>
              <td class="py-4 px-6 whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <template v-if="item.is_automatic">
                    <span class="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-600" title="Kunci Otomatis (Sistem)">
                      <Lock :size="14" />
                    </span>
                  </template>
                  <template v-else>
                    <button
                      @click="openEditModal(item)"
                      class="p-2 bg-[#141420] border border-white/5 hover:bg-purple-600/10 hover:border-purple-600/20 hover:text-purple-400 rounded-xl transition-all duration-150"
                      title="Edit"
                    >
                      <Edit2 :size="13" />
                    </button>
                    <button
                      @click="deleteItem(item.id)"
                      class="p-2 bg-[#141420] border border-white/5 hover:bg-rose-600/10 hover:border-rose-600/20 hover:text-rose-400 rounded-xl transition-all duration-150"
                      title="Hapus"
                    >
                      <Trash2 :size="13" />
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="meta && meta.last_page > 1" class="p-6 border-t border-white/5 flex items-center justify-between">
        <span class="text-xs text-gray-500 font-semibold">
          Halaman {{ meta.current_page }} dari {{ meta.last_page }}
        </span>
        <div class="flex items-center gap-2">
          <button
            @click="changePage(meta.current_page - 1)"
            :disabled="meta.current_page === 1"
            class="p-2 bg-[#141420] border border-white/5 hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all duration-150"
          >
            <ChevronLeft :size="15" />
          </button>
          <button
            @click="changePage(meta.current_page + 1)"
            :disabled="meta.current_page === meta.last_page"
            class="p-2 bg-[#141420] border border-white/5 hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all duration-150"
          >
            <ChevronRight :size="15" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form (Add / Edit) -->
    <BaseModal v-model="modalOpen" :title="editMode ? 'Edit Transaksi Kas' : 'Catat Transaksi Manual'" size="md">
      <form @submit.prevent="submitForm" class="space-y-4 pt-2">
        <!-- Input Type -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-400">Jenis Transaksi</label>
          <div class="grid grid-cols-2 gap-3">
            <label
              class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-semibold transition-all duration-200"
              :class="form.type === 'IN'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#141420] border-white/10 text-gray-400 hover:border-white/20'"
            >
              <input type="radio" value="IN" v-model="form.type" class="sr-only" />
              Kas Masuk (IN)
            </label>
            <label
              class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-semibold transition-all duration-200"
              :class="form.type === 'OUT'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#141420] border-white/10 text-gray-400 hover:border-white/20'"
            >
              <input type="radio" value="OUT" v-model="form.type" class="sr-only" />
              Kas Keluar (OUT)
            </label>
          </div>
        </div>

        <!-- Input Category -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Kategori</label>
          <select
            v-model="form.category"
            required
            class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Pilih Kategori</option>
            <option v-for="cat in availableFormCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Custom Category Input if "Lainnya" chosen -->
        <transition name="fade">
          <div v-if="form.category === 'Lainnya'" class="space-y-1.5">
            <label class="text-xs font-semibold text-gray-400">Nama Kategori Kustom</label>
            <input
              type="text"
              v-model="form.customCategory"
              placeholder="Masukkan nama kategori kustom..."
              required
              class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </transition>

        <!-- Input Amount -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Jumlah Uang (Rupiah)</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">Rp</span>
            <input
              type="number"
              v-model.number="form.amount"
              required
              min="1"
              placeholder="0"
              class="w-full bg-[#141420] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#e0e0ef] font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <!-- Input Transaction Date -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Tanggal Transaksi</label>
          <input
            type="date"
            v-model="form.transaction_date"
            required
            class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <!-- Input Notes -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400">Keterangan / Catatan</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Contoh: Belanja bawang merah, bayar kurir gas LPG, dll..."
            class="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[#e0e0ef] focus:outline-none focus:ring-1 focus:ring-purple-500"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            @click="modalOpen = false"
            class="px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white text-sm font-semibold transition-all duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="formSubmitting"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold transition-all duration-150 shadow-lg shadow-purple-600/10"
          >
            {{ formSubmitting ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  Plus, Search, Edit2, Trash2, Lock, ArrowLeftRight, ChevronLeft, ChevronRight, X, RefreshCw, ArrowDownToLine, ArrowUpFromLine, Wallet
} from '@lucide/vue'
import { financeApi } from '../../../api/apiService'
import { useAdminStore } from '../../../stores/admin'
import BaseModal from '../../../components/admin/BaseModal.vue'

const adminStore = useAdminStore()
const loading = ref(true)

const cashflows = ref([])
const summary = ref({ total_in: 0, total_out: 0, net_saldo: 0 })
const meta = ref(null)
const currentPage = ref(1)

const filters = ref({
  search: '',
  type: '',
  category: '',
  start_date: '',
  end_date: ''
})

const presetCategories = ref([
  'Belanja Pasar',
  'Beli Gas',
  'Bayar Kurir',
  'Gaji & Upah',
  'Listrik & Air',
  'Kemasan & Packaging',
  'Biaya Operasional',
  'Perbaikan & Perawatan',
  'Sewa & Tagihan',
  'Lainnya'
])

// Compute categories based on Transaction Type (IN vs OUT)
const availableFormCategories = computed(() => {
  if (form.value.type === 'IN') {
    return ['Order Payment', 'Order DP', 'Lainnya']
  }
  return presetCategories.value
})

const hasActiveFilters = computed(() => {
  return filters.value.search !== '' ||
         filters.value.type !== '' ||
         filters.value.category !== '' ||
         filters.value.start_date !== '' ||
         filters.value.end_date !== ''
})

const handleFilterChange = () => {
  currentPage.value = 1
  fetchData()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    type: '',
    category: '',
    start_date: '',
    end_date: ''
  }
  currentPage.value = 1
  fetchData()
}

const fetchData = async () => {
  loading.value = true
  try {
    // Filter out empty params
    const activeFilters = {}
    Object.entries(filters.value).forEach(([k, v]) => {
      if (v) activeFilters[k] = v
    })

    const [res, monthRes, yearRes] = await Promise.all([
      financeApi.getCashflows(currentPage.value, 15, activeFilters),
      financeApi.getOverview('this_month'),
      financeApi.getOverview('this_year')
    ])

    if (res.status === 'success') {
      cashflows.value = res.data
      meta.value = res.meta
      
      const summaryData = res.summary || { total_in: 0, total_out: 0, net_saldo: 0 }
      
      if (monthRes.status === 'success') {
        summaryData.total_in_month = monthRes.data.cards.total_pendapatan.value
        summaryData.total_out_month = monthRes.data.cards.total_pengeluaran.value
        summaryData.net_saldo_month = monthRes.data.cards.laba_bersih.value
      }
      
      if (yearRes.status === 'success') {
        summaryData.total_in_year = yearRes.data.cards.total_pendapatan.value
        summaryData.total_out_year = yearRes.data.cards.total_pengeluaran.value
        summaryData.net_saldo_year = yearRes.data.cards.laba_bersih.value
      }

      summary.value = summaryData
    }
  } catch (error) {
    console.error('Error fetching cashflow records:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  currentPage.value = page
  fetchData()
}

// Modal & Form Logic
const modalOpen = ref(false)
const editMode = ref(false)
const editingId = ref(null)
const formSubmitting = ref(false)

const getTodayString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const form = ref({
  type: 'OUT',
  category: '',
  customCategory: '',
  amount: null,
  transaction_date: getTodayString(),
  notes: ''
})

const openAddModal = () => {
  editMode.value = false
  editingId.value = null
  form.value = {
    type: 'OUT',
    category: '',
    customCategory: '',
    amount: null,
    transaction_date: getTodayString(),
    notes: ''
  }
  modalOpen.value = true
}

const openEditModal = (item) => {
  editMode.value = true
  editingId.value = item.id

  const isPreset = presetCategories.value.includes(item.category) || item.category === 'Order Payment' || item.category === 'Order DP'

  form.value = {
    type: item.type,
    category: isPreset ? item.category : 'Lainnya',
    customCategory: isPreset ? '' : item.category,
    amount: item.amount,
    transaction_date: item.transaction_date.substring(0, 10),
    notes: item.notes || ''
  }
  modalOpen.value = true
}

const submitForm = async () => {
  formSubmitting.value = true
  try {
    const finalCategory = form.value.category === 'Lainnya' ? form.value.customCategory : form.value.category
    const payload = {
      type: form.value.type,
      category: finalCategory,
      amount: form.value.amount,
      transaction_date: form.value.transaction_date,
      notes: form.value.notes
    }

    let res
    if (editMode.value) {
      res = await financeApi.updateCashflow(editingId.value, payload)
    } else {
      res = await financeApi.createCashflow(payload)
    }

    if (res.status === 'success') {
      adminStore.showToast(editMode.value ? 'Catatan kas berhasil diupdate!' : 'Catatan kas berhasil disimpan!', 'success')
      modalOpen.value = false
      fetchData()
    } else {
      adminStore.showToast(res.message || 'Gagal menyimpan transaksi.', 'error')
    }
  } catch (error) {
    adminStore.showToast('Ada kesalahan sistem, coba lagi.', 'error')
  } finally {
    formSubmitting.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus catatan kas manual ini?')) return
  try {
    const res = await financeApi.deleteCashflow(id)
    if (res.status === 'success') {
      adminStore.showToast('Catatan kas berhasil dihapus!', 'success')
      fetchData()
    } else {
      adminStore.showToast(res.message || 'Gagal menghapus transaksi.', 'error')
    }
  } catch (error) {
    adminStore.showToast('Gagal menghapus transaksi karena kesalahan server.', 'error')
  }
}

// Helpers
const formatCurrency = (val) => {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

const formatDate = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
